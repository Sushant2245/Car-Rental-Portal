import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Sample car data - later this will come from your backend API
const sampleCars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "midsize",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 45,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 5,
    features: ["GPS Navigation", "Bluetooth", "Air Conditioning", "Backup Camera"],
    rating: 4.8,
    reviews: 124,
    available: true,
    location: "New York"
  },
  {
    id: 2,
    name: "BMW X5",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 89,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 5,
    features: ["Premium Sound", "Leather Seats", "Sunroof", "GPS Navigation"],
    rating: 4.9,
    reviews: 87,
    available: true,
    location: "Los Angeles"
  },
  {
    id: 3,
    name: "Honda Civic",
    category: "compact",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 35,
    transmission: "Manual",
    fuel: "Gasoline",
    seats: 5,
    features: ["Fuel Efficient", "Bluetooth", "Air Conditioning"],
    rating: 4.6,
    reviews: 203,
    available: true,
    location: "Chicago"
  },
  {
    id: 4,
    name: "Tesla Model 3",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 95,
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    features: ["Autopilot", "Premium Interior", "Supercharging", "Over-the-air Updates"],
    rating: 4.9,
    reviews: 156,
    available: true,
    location: "San Francisco"
  },
  {
    id: 5,
    name: "Jeep Wrangler",
    category: "suv",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 65,
    transmission: "Manual",
    fuel: "Gasoline",
    seats: 4,
    features: ["4WD", "Removable Doors", "Off-road Capable", "Bluetooth"],
    rating: 4.7,
    reviews: 98,
    available: true,
    location: "Denver"
  },
  {
    id: 6,
    name: "Ford Mustang Convertible",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    pricePerDay: 75,
    transmission: "Automatic",
    fuel: "Gasoline",
    seats: 4,
    features: ["Convertible Top", "Premium Sound", "Sport Mode", "Bluetooth"],
    rating: 4.8,
    reviews: 142,
    available: false,
    location: "Miami"
  }
];

function CarListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState(sampleCars);
  const [filteredCars, setFilteredCars] = useState(sampleCars);
  const [filters, setFilters] = useState({
    carType: '',
    priceRange: '',
    transmission: '',
    fuel: '',
    sortBy: 'name'
  });
  const [searchParams, setSearchParams] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: ''
  });

  // Get search parameters from navigation state (from HeroSection search)
  useEffect(() => {
    if (location.state?.searchData) {
      setSearchParams(location.state.searchData);
      applySearchFilters(location.state.searchData);
    }
  }, [location.state]);

  const applySearchFilters = (searchData) => {
    let filtered = [...sampleCars];

    // Filter by car type if specified
    if (searchData.carType) {
      filtered = filtered.filter(car => car.category === searchData.carType);
    }

    // Filter by location if specified
    if (searchData.location) {
      filtered = filtered.filter(car => 
        car.location.toLowerCase().includes(searchData.location.toLowerCase())
      );
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...cars];

    // Apply car type filter
    if (currentFilters.carType) {
      filtered = filtered.filter(car => car.category === currentFilters.carType);
    }

    // Apply price range filter
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(car => car.pricePerDay >= min && car.pricePerDay <= max);
    }

    // Apply transmission filter
    if (currentFilters.transmission) {
      filtered = filtered.filter(car => car.transmission === currentFilters.transmission);
    }

    // Apply fuel filter
    if (currentFilters.fuel) {
      filtered = filtered.filter(car => car.fuel === currentFilters.fuel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'price-low':
          return a.pricePerDay - b.pricePerDay;
        case 'price-high':
          return b.pricePerDay - a.pricePerDay;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCars(filtered);
  };

  const handleCarSelect = (carId) => {
    navigate(`/car-details/${carId}`, { 
      state: { 
        searchParams,
        returnTo: '/car-listing'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements - Same as HeroSection */}
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

      {/* Back Navigation & Breadcrumbs */}
      <div className="relative pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </button>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-slate-300">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-white transition-colors duration-300"
              >
                🏠 Home
              </button>
              <span className="text-slate-500">→</span>
              <span className="text-blue-400 font-semibold">Car Listings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
              Premium Car Selection
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Available 
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text animate-gradient-x">
              RentWheels
            </span>
          </h1>
          {searchParams.location && (
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-4">
              Showing results for <span className="text-blue-400 font-semibold">{searchParams.location}</span>
              {searchParams.pickupDate && <span className="text-green-400"> • {searchParams.pickupDate}</span>}
              {searchParams.returnDate && <span className="text-purple-400"> to {searchParams.returnDate}</span>}
            </p>
          )}
          <p className="text-lg text-slate-400 mb-8">
            Found <span className="text-white font-bold">{filteredCars.length}</span> premium car{filteredCars.length !== 1 ? 's' : ''} available
          </p>
          
          {/* New Search Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="group bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-semibold">Start New Search</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="text-blue-400">🔍</span>
                Filters
              </h3>
              
              {/* Car Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-orange-400">🚗</span>
                  Car Type
                </label>
                <select
                  value={filters.carType}
                  onChange={(e) => handleFilterChange('carType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-gray-900 transition-all duration-300"
                >
                  <option value="">All Types</option>
                  <option value="economy">Economy</option>
                  <option value="compact">Compact</option>
                  <option value="midsize">Midsize</option>
                  <option value="luxury">Luxury</option>
                  <option value="suv">SUV</option>
                  <option value="convertible">Convertible</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">💰</span>
                  Price Range (per day)
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-green-400 focus:bg-white text-gray-900 transition-all duration-300"
                >
                  <option value="">Any Price</option>
                  <option value="0-40">$0 - $40</option>
                  <option value="41-70">$41 - $70</option>
                  <option value="71-100">$71 - $100</option>
                  <option value="101-999">$100+</option>
                </select>
              </div>

              {/* Transmission Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-purple-400">⚙️</span>
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white text-gray-900 transition-all duration-300"
                >
                  <option value="">Any</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">⛽</span>
                  Fuel Type
                </label>
                <select
                  value={filters.fuel}
                  onChange={(e) => handleFilterChange('fuel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-900 transition-all duration-300"
                >
                  <option value="">Any</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-pink-400">📊</span>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-400 focus:bg-white text-gray-900 transition-all duration-300"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (Highest)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Car Listings */}
          <div className="lg:w-3/4">
            {filteredCars.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                  <div className="text-8xl mb-6 animate-bounce">🚗</div>
                  <h3 className="text-3xl font-bold text-white mb-4">No cars found</h3>
                  <p className="text-slate-300 text-lg">Try adjusting your filters or search criteria</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105"
                    onClick={() => handleCarSelect(car.id)}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-2xl text-sm font-bold text-gray-900 shadow-lg">
                        ${car.pricePerDay}/day
                      </div>
                      {!car.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
                          <span className="text-white text-xl font-bold bg-red-500 px-6 py-3 rounded-2xl">Not Available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{car.name}</h3>
                        <div className="flex items-center text-yellow-400">
                          <span className="text-lg font-bold">{car.rating}</span>
                          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-slate-300 ml-1">({car.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-slate-300">
                        <div className="flex items-center text-sm">
                          <span className="mr-2 text-purple-400">⚙️</span>
                          {car.transmission}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2 text-yellow-400">⛽</span>
                          {car.fuel}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2 text-blue-400">👥</span>
                          {car.seats} seats
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2 text-green-400">📍</span>
                          {car.location}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {car.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30 backdrop-blur-sm"
                            >
                              {feature}
                            </span>
                          ))}
                          {car.features.length > 3 && (
                            <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs rounded-full border border-white/20">
                              +{car.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        className="group relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCarSelect(car.id);
                        }}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details & Book
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarListing;
