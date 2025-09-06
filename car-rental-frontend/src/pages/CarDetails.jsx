import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Sample car data - same as in CarListing
const sampleCars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "midsize",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 45,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 5,
    features: ["GPS Navigation", "Bluetooth", "Air Conditioning", "Backup Camera"],
    rating: 4.8,
    reviews: 124,
    available: true,
    location: "New York",
    description: "The Toyota Camry offers a perfect blend of comfort, reliability, and fuel efficiency. Ideal for business trips or family vacations with spacious interior and advanced safety features."
  },
  {
    id: 2,
    name: "BMW X5",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 89,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 7,
    features: ["Premium Sound", "Leather Seats", "Sunroof", "All-Wheel Drive"],
    rating: 4.9,
    reviews: 89,
    available: true,
    location: "Los Angeles",
    description: "Experience luxury and performance with the BMW X5. Premium leather interior, advanced technology, and powerful engine make every journey extraordinary."
  },
  {
    id: 3,
    name: "Honda Civic",
    category: "economy",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 35,
    transmission: "Manual",
    fuel: "Gasoline",
    seats: 5,
    features: ["Fuel Efficient", "Bluetooth", "Air Conditioning"],
    rating: 4.6,
    reviews: 156,
    available: true,
    location: "Chicago",
    description: "The Honda Civic is perfect for budget-conscious travelers who don't want to compromise on quality. Excellent fuel economy and reliable performance."
  },
  {
    id: 4,
    name: "Tesla Model 3",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 75,
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    features: ["Autopilot", "Premium Interior", "Supercharging", "Over-the-air Updates"],
    rating: 4.9,
    reviews: 203,
    available: true,
    location: "San Francisco",
    description: "Drive the future with Tesla Model 3. Zero emissions, cutting-edge technology, and autopilot features for an unmatched driving experience."
  },
  {
    id: 5,
    name: "Jeep Wrangler",
    category: "suv",
    image: "https://images.unsplash.com/photo-1606016159991-8b5d2e2c8b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 65,
    transmission: "Manual",
    fuel: "Gasoline",
    seats: 4,
    features: ["4WD", "Removable Doors", "Off-Road Capable", "Bluetooth"],
    rating: 4.7,
    reviews: 98,
    available: true,
    location: "Denver",
    description: "Adventure awaits with the Jeep Wrangler. Built for off-road exploration with removable doors and roof for the ultimate outdoor experience."
  },
  {
    id: 6,
    name: "Ford Mustang Convertible",
    category: "convertible",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    pricePerDay: 95,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 4,
    features: ["Convertible Top", "Premium Sound", "Sport Mode", "Heated Seats"],
    rating: 4.8,
    reviews: 67,
    available: true,
    location: "Miami",
    description: "Feel the wind in your hair with the Ford Mustang Convertible. Classic American muscle car with modern comfort and style."
  }
];

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: '',
    totalDays: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const foundCar = sampleCars.find(c => c.id === parseInt(id));
    setCar(foundCar);
    
    // Get search params from navigation state if available
    if (location.state?.searchParams) {
      setBookingData(prev => ({
        ...prev,
        pickupDate: location.state.searchParams.pickupDate || '',
        returnDate: location.state.searchParams.returnDate || ''
      }));
    }
  }, [id, location.state]);

  useEffect(() => {
    if (bookingData.pickupDate && bookingData.returnDate && car) {
      const pickup = new Date(bookingData.pickupDate);
      const returnDate = new Date(bookingData.returnDate);
      const timeDiff = returnDate.getTime() - pickup.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff > 0) {
        setBookingData(prev => ({
          ...prev,
          totalDays: daysDiff,
          totalPrice: daysDiff * car.pricePerDay
        }));
      }
    }
  }, [bookingData.pickupDate, bookingData.returnDate, car]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) {
      alert('Please select pickup and return dates');
      return;
    }
    
    // Here you would typically send booking data to your backend
    alert(`Booking confirmed for ${car.name}!\nTotal: $${bookingData.totalPrice} for ${bookingData.totalDays} days`);
  };

  const goBack = () => {
    if (location.state?.returnTo) {
      navigate(location.state.returnTo);
    } else {
      navigate('/car-listing');
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold mb-2">Car not found</h2>
          <button 
            onClick={() => navigate('/car-listing')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Back to Car Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }}>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="relative pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goBack}
              className="group flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Listings</span>
            </button>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-slate-300">
              <button onClick={() => navigate('/')} className="hover:text-white transition-colors duration-300">
                🏠 Home
              </button>
              <span className="text-slate-500">→</span>
              <button onClick={() => navigate('/car-listing')} className="hover:text-white transition-colors duration-300">
                Car Listings
              </button>
              <span className="text-slate-500">→</span>
              <span className="text-blue-400 font-semibold">{car.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Car Details Content */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Car Image and Details */}
          <div className="space-y-8">
            {/* Car Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{car.name}</h1>
                  <div className="flex items-center text-yellow-400 mb-4">
                    <span className="text-xl font-bold">{car.rating}</span>
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-slate-300 ml-2">({car.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">${car.pricePerDay}</div>
                  <div className="text-slate-300">per day</div>
                </div>
              </div>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">{car.description}</p>

              {/* Car Specs */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-slate-300">
                  <span className="mr-3 text-purple-400">⚙️</span>
                  <div>
                    <div className="font-semibold text-white">Transmission</div>
                    <div>{car.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-300">
                  <span className="mr-3 text-yellow-400">⛽</span>
                  <div>
                    <div className="font-semibold text-white">Fuel Type</div>
                    <div>{car.fuel}</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-300">
                  <span className="mr-3 text-blue-400">👥</span>
                  <div>
                    <div className="font-semibold text-white">Seats</div>
                    <div>{car.seats} passengers</div>
                  </div>
                </div>
                <div className="flex items-center text-slate-300">
                  <span className="mr-3 text-green-400">📍</span>
                  <div>
                    <div className="font-semibold text-white">Location</div>
                    <div>{car.location}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Features</h3>
                <div className="flex flex-wrap gap-3">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30 backdrop-blur-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">📅</span>
                Book This Car
              </h2>

              <div className="space-y-6">
                {/* Pickup Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-green-400">📅</span>
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={bookingData.pickupDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-green-400 focus:bg-white text-gray-900 transition-all duration-300"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📅</span>
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={bookingData.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white text-gray-900 transition-all duration-300"
                  />
                </div>

                {/* Booking Summary */}
                {bookingData.totalDays > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-slate-300">
                      <div className="flex justify-between">
                        <span>Daily Rate:</span>
                        <span className="text-white font-semibold">${car.pricePerDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-white font-semibold">{bookingData.totalDays} day{bookingData.totalDays !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="border-t border-white/20 pt-3">
                        <div className="flex justify-between text-xl">
                          <span className="font-bold text-white">Total:</span>
                          <span className="font-bold text-green-400">${bookingData.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Book Now - ${bookingData.totalPrice || car.pricePerDay}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
