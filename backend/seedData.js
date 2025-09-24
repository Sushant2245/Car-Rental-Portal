const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Car = require('./models/Car');

// Sample users
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '1234567890',
    role: 'user',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    licenseNumber: 'DL123456789',
    isVerified: true
  },
  {
    name: 'Admin User',
    email: 'admin@carrental.com',
    password: 'admin123',
    phone: '9999999999',
    role: 'admin',
    address: {
      street: '456 Admin Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    licenseNumber: 'ADMIN123456',
    isVerified: true
  }
];

// Sample cars
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
      address: '123 Car Lot St'
    },
    features: ['air_conditioning', 'gps', 'bluetooth', 'backup_camera'],
    images: [{
      url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'NYC123',
    mileage: 15000,
    condition: 'excellent',
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
    seatingCapacity: 5,
    pricePerDay: 89,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Luxury Ave'
    },
    features: ['air_conditioning', 'gps', 'bluetooth', 'leather_seats', 'sunroof'],
    images: [{
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'LAX456',
    mileage: 8000,
    condition: 'excellent',
    availability: true,
    isActive: true
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    type: 'hatchback',
    transmission: 'manual',
    fuelType: 'petrol',
    seatingCapacity: 5,
    pricePerDay: 35,
    location: {
      city: 'Chicago',
      state: 'IL',
      address: '789 Economy St'
    },
    features: ['air_conditioning', 'bluetooth', 'usb_charging'],
    images: [{
      url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'CHI789',
    mileage: 25000,
    condition: 'good',
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
    pricePerDay: 95,
    location: {
      city: 'San Francisco',
      state: 'CA',
      address: '101 Electric Ave'
    },
    features: ['air_conditioning', 'gps', 'bluetooth', 'usb_charging'],
    images: [{
      url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'SF001',
    mileage: 5000,
    condition: 'excellent',
    availability: true,
    isActive: true
  },
  {
    make: 'Jeep',
    model: 'Wrangler',
    year: 2022,
    type: 'suv',
    transmission: 'manual',
    fuelType: 'petrol',
    seatingCapacity: 4,
    pricePerDay: 65,
    location: {
      city: 'Denver',
      state: 'CO',
      address: '202 Adventure Blvd'
    },
    features: ['air_conditioning', 'bluetooth'],
    images: [{
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'DEN202',
    mileage: 12000,
    condition: 'good',
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
    pricePerDay: 75,
    location: {
      city: 'Miami',
      state: 'FL',
      address: '303 Beach Drive'
    },
    features: ['air_conditioning', 'bluetooth', 'leather_seats'],
    images: [{
      url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isMain: true
    }],
    licensePlate: 'MIA303',
    mileage: 8500,
    condition: 'excellent',
    availability: false,
    isActive: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Add owner to cars (use admin user as owner)
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const carsWithOwner = sampleCars.map(car => ({
      ...car,
      owner: adminUser._id
    }));

    // Create cars
    const createdCars = await Car.create(carsWithOwner);
    console.log(`Created ${createdCars.length} cars`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('User: john.doe@example.com / password123');
    console.log('Admin: admin@carrental.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
