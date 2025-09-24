const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash'],
    required: true
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  dropoffLocation: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  driverDetails: {
    name: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  additionalServices: [{
    service: {
      type: String,
      enum: ['insurance', 'gps', 'child_seat', 'additional_driver', 'fuel_package']
    },
    price: Number
  }],
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    },
    createdAt: Date
  },
  mileageStart: {
    type: Number,
    default: 0
  },
  mileageEnd: {
    type: Number,
    default: 0
  },
  fuelLevelStart: {
    type: String,
    enum: ['empty', 'quarter', 'half', 'three_quarter', 'full'],
    default: 'full'
  },
  fuelLevelEnd: {
    type: String,
    enum: ['empty', 'quarter', 'half', 'three_quarter', 'full']
  },
  damageReport: [{
    description: String,
    images: [String],
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total days and amount before validation so required validators pass
bookingSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (this.pricePerDay) {
      let baseAmount = this.totalDays * this.pricePerDay;

      // Add additional services cost
      if (this.additionalServices && this.additionalServices.length > 0) {
        const servicesTotal = this.additionalServices.reduce((sum, service) => sum + (service.price || 0), 0);
        baseAmount += servicesTotal;
      }

      this.totalAmount = baseAmount;
    }
  }
  next();
});

// Validate dates prior to validation to surface meaningful errors
bookingSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate) {
    if (this.endDate <= this.startDate) {
      return next(new Error('End date must be after start date'));
    }

    if (this.startDate < new Date()) {
      return next(new Error('Start date cannot be in the past'));
    }
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
