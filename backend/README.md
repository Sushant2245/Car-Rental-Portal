# Car Rental Backend API

A comprehensive backend API for a car rental management system built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt
  - Profile management

- **Car Management**
  - CRUD operations for cars
  - Image upload with Cloudinary integration
  - Advanced filtering and search
  - Availability checking
  - Review and rating system

- **Booking System**
  - Complete booking lifecycle management
  - Date validation and conflict checking
  - Payment status tracking
  - Mileage and fuel level tracking
  - Booking reviews

- **Admin Dashboard**
  - User management
  - Booking statistics
  - Revenue tracking
  - System analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/car-rental
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |

### Car Routes (`/api/cars`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all cars with filters | Public |
| GET | `/:id` | Get single car | Public |
| POST | `/` | Create new car | Admin |
| PUT | `/:id` | Update car | Admin |
| DELETE | `/:id` | Delete car | Admin |
| POST | `/:id/reviews` | Add car review | Private |
| GET | `/availability/:id` | Check availability | Public |

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get bookings | Private |
| POST | `/` | Create booking | Private |
| GET | `/:id` | Get single booking | Private |
| PUT | `/:id/status` | Update booking status | Private |
| PUT | `/:id/payment` | Update payment status | Admin |
| POST | `/:id/review` | Add booking review | Private |
| PUT | `/:id/mileage` | Update mileage | Admin |
| GET | `/stats/dashboard` | Get booking statistics | Admin |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get user by ID | Private |
| PUT | `/:id` | Update user | Private |
| DELETE | `/:id` | Delete user | Admin |
| GET | `/:id/bookings` | Get user bookings | Private |
| GET | `/:id/stats` | Get user statistics | Private |
| PUT | `/:id/verify` | Verify user account | Admin |
| GET | `/stats/dashboard` | Get user dashboard stats | Admin |

## Request/Response Examples

### User Registration
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "licenseNumber": "DL123456789",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

### Car Creation
```json
POST /api/cars
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "type": "sedan",
  "transmission": "automatic",
  "fuelType": "petrol",
  "seatingCapacity": 5,
  "pricePerDay": 50,
  "location": {
    "city": "New York",
    "state": "NY",
    "address": "123 Car Lot St"
  },
  "features": ["air_conditioning", "gps", "bluetooth"],
  "licensePlate": "ABC123"
}
```

### Booking Creation
```json
POST /api/bookings
{
  "car": "car_id_here",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-20T10:00:00Z",
  "paymentMethod": "credit_card",
  "pickupLocation": {
    "address": "123 Pickup St",
    "city": "New York",
    "state": "NY"
  },
  "dropoffLocation": {
    "address": "456 Dropoff Ave",
    "city": "New York",
    "state": "NY"
  },
  "driverDetails": {
    "name": "John Doe",
    "licenseNumber": "DL123456789",
    "phone": "1234567890"
  }
}
```

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, role)
- Address and license details
- Profile image and verification status

### Car Model
- Vehicle details (make, model, year, type)
- Pricing and location information
- Features and images
- Availability and rating system

### Booking Model
- User and car references
- Date range and pricing
- Location details (pickup/dropoff)
- Status tracking and reviews
- Mileage and fuel tracking

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- File upload restrictions
- CORS configuration

## Development

### Adding New Routes
1. Create route file in `/routes` directory
2. Define middleware and validation
3. Import and use in `server.js`

### Database Seeding
You can create seed data for development:

```javascript
// Create admin user
const admin = await User.create({
  name: "Admin User",
  email: "admin@carrental.com",
  password: "admin123",
  phone: "9999999999",
  licenseNumber: "ADMIN123",
  role: "admin"
});
```

## Deployment

1. Set `NODE_ENV=production`
2. Use environment variables for all sensitive data
3. Set up MongoDB Atlas for cloud database
4. Configure Cloudinary for image storage
5. Use PM2 or similar for process management

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the ISC License.
