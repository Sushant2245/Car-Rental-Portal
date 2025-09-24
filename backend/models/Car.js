const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Car year is required'],
    min: [1990, 'Car year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Car year cannot be in the future']
  },
  type: {
    type: String,
    required: [true, 'Car type is required'],
    enum: ['sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon', 'truck', 'van']
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['manual', 'automatic']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['petrol', 'diesel', 'electric', 'hybrid']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: [2, 'Minimum seating capacity is 2'],
    max: [8, 'Maximum seating capacity is 8']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  features: [{
    type: String,
    enum: ['air_conditioning', 'gps', 'bluetooth', 'backup_camera', 'sunroof', 'leather_seats', 'heated_seats', 'usb_charging', 'wifi', 'child_seat']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    uppercase: true
  },
  mileage: {
    type: Number,
    default: 0,
    min: [0, 'Mileage cannot be negative']
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair'],
    default: 'good'
  },
  availability: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
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
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
carSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

// Index for search functionality
carSchema.index({ 'location.city': 1, 'location.state': 1 });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ type: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ availability: 1 });

module.exports = mongoose.model('Car', carSchema);
