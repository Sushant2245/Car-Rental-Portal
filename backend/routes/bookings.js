const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, [
  body('car').isMongoId().withMessage('Valid car ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'cash']).withMessage('Invalid payment method'),
  body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
  body('pickupLocation.city').notEmpty().withMessage('Pickup city is required'),
  body('pickupLocation.state').notEmpty().withMessage('Pickup state is required'),
  body('dropoffLocation.address').notEmpty().withMessage('Dropoff address is required'),
  body('dropoffLocation.city').notEmpty().withMessage('Dropoff city is required'),
  body('dropoffLocation.state').notEmpty().withMessage('Dropoff state is required'),
  body('driverDetails.name').notEmpty().withMessage('Driver name is required'),
  body('driverDetails.licenseNumber').notEmpty().withMessage('Driver license number is required'),
  body('driverDetails.phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      car: carId,
      startDate,
      endDate,
      paymentMethod,
      pickupLocation,
      dropoffLocation,
      driverDetails,
      additionalServices,
      specialRequests
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (!car.availability || !car.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking'
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: start },
          endDate: { $gt: start }
        },
        {
          startDate: { $lt: end },
          endDate: { $gte: end }
        },
        {
          startDate: { $gte: start },
          endDate: { $lte: end }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      car: carId,
      startDate: start,
      endDate: end,
      pricePerDay: car.pricePerDay,
      paymentMethod,
      pickupLocation,
      dropoffLocation,
      driverDetails,
      additionalServices: additionalServices || [],
      specialRequests
    });

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'car', select: 'make model year licensePlate images pricePerDay' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings or all bookings (admin)
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('car', 'make model year licensePlate images pricePerDay location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car', 'make model year licensePlate images pricePerDay location owner')
      .populate('car.owner', 'name phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user can access this booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin or booking owner)
router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('cancellationReason').optional().isLength({ max: 500 }).withMessage('Cancellation reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' || 
                     booking.user.toString() === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, cancellationReason } = req.body;

    // Validate status transitions
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    // Update booking
    booking.status = status;
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'car', select: 'make model year licensePlate' }
    ]);

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

// @route   PUT /api/bookings/:id/payment
// @desc    Update payment status
// @access  Private (Admin only)
router.put('/:id/payment', protect, adminOnly, [
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.paymentStatus = req.body.paymentStatus;
    await booking.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
});

// @route   POST /api/bookings/:id/review
// @desc    Add review to booking
// @access  Private
router.post('/:id/review', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if already reviewed
    if (booking.review) {
      return res.status(400).json({
        success: false,
        message: 'Booking already reviewed'
      });
    }

    // Add review to booking
    booking.review = {
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date()
    };

    await booking.save();

    // Add review to car
    const car = await Car.findById(booking.car);
    car.reviews.push({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    car.calculateAverageRating();
    await car.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: booking
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   PUT /api/bookings/:id/mileage
// @desc    Update mileage for booking
// @access  Private (Admin only)
router.put('/:id/mileage', protect, adminOnly, [
  body('mileageStart').optional().isFloat({ min: 0 }).withMessage('Start mileage must be non-negative'),
  body('mileageEnd').optional().isFloat({ min: 0 }).withMessage('End mileage must be non-negative'),
  body('fuelLevelStart').optional().isIn(['empty', 'quarter', 'half', 'three_quarter', 'full']).withMessage('Invalid fuel level'),
  body('fuelLevelEnd').optional().isIn(['empty', 'quarter', 'half', 'three_quarter', 'full']).withMessage('Invalid fuel level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const updates = {};
    if (req.body.mileageStart !== undefined) updates.mileageStart = req.body.mileageStart;
    if (req.body.mileageEnd !== undefined) updates.mileageEnd = req.body.mileageEnd;
    if (req.body.fuelLevelStart) updates.fuelLevelStart = req.body.fuelLevelStart;
    if (req.body.fuelLevelEnd) updates.fuelLevelEnd = req.body.fuelLevelEnd;

    // Validate mileage logic
    if (updates.mileageEnd && booking.mileageStart && updates.mileageEnd < booking.mileageStart) {
      return res.status(400).json({
        success: false,
        message: 'End mileage cannot be less than start mileage'
      });
    }

    Object.assign(booking, updates);
    await booking.save();

    res.json({
      success: true,
      message: 'Mileage updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update mileage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating mileage'
    });
  }
});

// @route   GET /api/bookings/stats/dashboard
// @desc    Get booking statistics for dashboard
// @access  Private (Admin only)
router.get('/stats/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    // Revenue calculation
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly bookings
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        monthlyBookings
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics'
    });
  }
});

module.exports = router;
