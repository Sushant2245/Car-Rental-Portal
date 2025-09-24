const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/cars
// @desc    Get all cars with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be non-negative')
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

    // Build filter object
    const filter = { isActive: true };

    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }

    if (req.query.state) {
      filter['location.state'] = new RegExp(req.query.state, 'i');
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.transmission) {
      filter.transmission = req.query.transmission;
    }

    if (req.query.fuelType) {
      filter.fuelType = req.query.fuelType;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.pricePerDay = {};
      if (req.query.minPrice) filter.pricePerDay.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.pricePerDay.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.seatingCapacity) {
      filter.seatingCapacity = { $gte: parseInt(req.query.seatingCapacity) };
    }

    if (req.query.availability !== undefined) {
      filter.availability = req.query.availability === 'true';
    }

    // Search by make or model
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { make: searchRegex },
        { model: searchRegex }
      ];
    }

    // Get cars with pagination
    const cars = await Car.find(filter)
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cars'
    });
  }
});

// @route   GET /api/cars/:id
// @desc    Get single car by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'name phone email')
      .populate('reviews.user', 'name');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching car'
    });
  }
});

// @route   POST /api/cars
// @desc    Create a new car
// @access  Private (Admin only)
router.post('/', protect, adminOnly, upload.array('images', 5), [
  body('make').trim().notEmpty().withMessage('Car make is required'),
  body('model').trim().notEmpty().withMessage('Car model is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('type').isIn(['sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon', 'truck', 'van']).withMessage('Invalid car type'),
  body('transmission').isIn(['manual', 'automatic']).withMessage('Invalid transmission type'),
  body('fuelType').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Invalid fuel type'),
  body('seatingCapacity').isInt({ min: 2, max: 8 }).withMessage('Seating capacity must be between 2 and 8'),
  body('pricePerDay').isFloat({ min: 0 }).withMessage('Price per day must be non-negative'),
  body('licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required')
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

    // Check if license plate already exists
    const existingCar = await Car.findOne({ licensePlate: req.body.licensePlate.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({
        success: false,
        message: 'Car with this license plate already exists'
      });
    }

    // Upload images to Cloudinary
    const imageUploads = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'car-rental/cars',
              transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });

        imageUploads.push({
          url: result.secure_url,
          publicId: result.public_id,
          isMain: i === 0
        });
      }
    }

    const carData = {
      ...req.body,
      owner: req.user.id,
      images: imageUploads,
      licensePlate: req.body.licensePlate.toUpperCase()
    };

    const car = await Car.create(carData);
    await car.populate('owner', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating car'
    });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update car
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'car-rental/cars',
              transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });

        imageUploads.push({
          url: result.secure_url,
          publicId: result.public_id,
          isMain: car.images.length === 0 && i === 0
        });
      }

      req.body.images = [...car.images, ...imageUploads];
    }

    car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email');

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating car'
    });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete car
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if car has active bookings
    const activeBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['confirmed', 'active'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete car with active bookings'
      });
    }

    // Delete images from Cloudinary
    if (car.images && car.images.length > 0) {
      for (const image of car.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await Car.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting car'
    });
  }
});

// @route   POST /api/cars/:id/reviews
// @desc    Add review to car
// @access  Private
router.post('/:id/reviews', protect, [
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

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if user has already reviewed this car
    const existingReview = car.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this car'
      });
    }

    // Check if user has completed a booking for this car
    const completedBooking = await Booking.findOne({
      user: req.user.id,
      car: req.params.id,
      status: 'completed'
    });

    if (!completedBooking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review cars you have rented'
      });
    }

    // Add review
    car.reviews.push({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    // Recalculate average rating
    car.calculateAverageRating();
    await car.save();

    await car.populate('reviews.user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: car
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/cars/availability/:id
// @desc    Check car availability for specific dates
// @access  Public
router.get('/availability/:id', [
  query('startDate').isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').isISO8601().withMessage('End date must be a valid date')
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

    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: req.params.id,
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

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      success: true,
      available: isAvailable,
      conflictingBookings: conflictingBookings.length
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking availability'
    });
  }
});

module.exports = router;
