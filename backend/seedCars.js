const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
require('dotenv').config();

const sampleCars = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'sedan',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 5,
    pricePerDay: 45,
    location: {
      city: 'New York',
      state: 'NY',
      address: '123 Main St, New York, NY'
    },
    features: ['gps', 'bluetooth', 'air_conditioning', 'backup_camera'],
    images: [{
      url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isMain: true
    }],
    licensePlate: 'NYC123',
    availability: true,
    isActive: true
  },
  {
    make: 'BMW',
    model: 'X5',
    year: 2023,
    type: 'suv',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 7,
    pricePerDay: 89,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Sunset Blvd, Los Angeles, CA'
    },
    features: ['leather_seats', 'sunroof', 'gps', 'bluetooth'],
    images: [{
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isMain: true
    }],
    licensePlate: 'LAX456',
    availability: true,
    isActive: true
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    type: 'sedan',
    transmission: 'manual',
    fuelType: 'petrol',
    seatingCapacity: 5,
    pricePerDay: 35,
    location: {
      city: 'Chicago',
      state: 'IL',
      address: '789 Lake Shore Dr, Chicago, IL'
    },
    features: ['bluetooth', 'air_conditioning'],
    images: [{
      url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isMain: true
    }],
    licensePlate: 'CHI789',
    availability: true,
    isActive: true
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'sedan',
    transmission: 'automatic',
    fuelType: 'electric',
    seatingCapacity: 5,
    pricePerDay: 75,
    location: {
      city: 'San Francisco',
      state: 'CA',
      address: '321 Market St, San Francisco, CA'
    },
    features: ['gps', 'bluetooth', 'heated_seats', 'sunroof'],
    images: [{
      url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isMain: true
    }],
    licensePlate: 'SF321',
    availability: true,
    isActive: true
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    type: 'convertible',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 4,
    pricePerDay: 95,
    location: {
      city: 'Miami',
      state: 'FL',
      address: '654 Ocean Dr, Miami, FL'
    },
    features: ['bluetooth', 'heated_seats', 'sunroof'],
    images: [{
      url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isMain: true
    }],
    licensePlate: 'MIA654',
    availability: true,
    isActive: true
  }
];

async function seedCars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');

    // Find or create a default user to own the cars
    let owner = await User.findOne({ email: 'admin@example.com' });
    
    if (!owner) {
      console.log('Creating default admin user...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      owner = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        phone: '1234567890',
        licenseNumber: 'ADMIN123456789',
        address: {
          street: '123 Admin St',
          city: 'Admin City',
          state: 'AS',
          zipCode: '12345'
        },
        isVerified: true
      });
      console.log('Created admin user:', owner.email);
    }

    // Clear existing cars (optional)
    const existingCount = await Car.countDocuments();
    console.log(`Found ${existingCount} existing cars`);
    
    if (existingCount === 0) {
      console.log('Seeding cars...');
      
      for (const carData of sampleCars) {
        carData.owner = owner._id;
        const car = await Car.create(carData);
        console.log(`Created car: ${car.make} ${car.model} (${car._id})`);
      }
      
      console.log('Cars seeded successfully!');
    } else {
      console.log('Cars already exist in database. Skipping seed.');
    }
    
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedCars();
