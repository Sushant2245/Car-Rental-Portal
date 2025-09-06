import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carPhoto from '../assets/carphoto.png';
import './HeroAnimations.css';

function HeroSection() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search Data:', searchData);
    
    // Navigate to car listing page with search data
    navigate('/car-listing', { 
      state: { 
        searchData: searchData 
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
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
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-12 flex flex-col justify-center min-h-screen">
        {/* Main Hero Section with Car Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Text Content */}
          <div className="text-left lg:text-left animate-fade-in-up">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
                Premium Car Rental Service
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Find Your Perfect 
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text animate-gradient-x">
                RentWheels
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-light mb-8">
              Experience premium car rental with our extensive fleet of vehicles. 
              From sleek sedans to powerful SUVs, embark on your journey with confidence and style.
            </p>
            
          </div>

          {/* Right Side - Car Image */}
          <div className="relative lg:order-last order-first">
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
              
              {/* Car image container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-500">
                <img 
                  src={carPhoto} 
                  alt="Premium Rental Car" 
                  className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 animate-slide-up">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey</h3>
              <p className="text-slate-300">Find the perfect car for your next adventure</p>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-blue-400">📍</span>
                    Pickup Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={searchData.location}
                      onChange={handleInputChange}
                      placeholder="Enter city or location"
                      className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:bg-white"
                    />
                  </div>
                </div>

                {/* Pickup Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-green-400">📅</span>
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={searchData.pickupDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-green-400 focus:bg-white text-gray-900 transition-all duration-300 group-hover:bg-white"
                  />
                </div>

                {/* Return Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📅</span>
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={searchData.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white text-gray-900 transition-all duration-300 group-hover:bg-white"
                  />
                </div>

                {/* Car Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🚗</span>
                    Car Type
                  </label>
                  <select
                    name="carType"
                    value={searchData.carType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white text-gray-900 transition-all duration-300 group-hover:bg-white"
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
              </div>

              {/* Enhanced Search Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Available Cars
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🚗</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Wide Selection</h3>
            <p className="text-slate-300 leading-relaxed">Choose from hundreds of premium vehicles across all categories and price ranges</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💰</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Best Prices</h3>
            <p className="text-slate-300 leading-relaxed">Competitive rates with transparent pricing and no hidden fees guaranteed</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🛡️</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Safe & Secure</h3>
            <p className="text-slate-300 leading-relaxed">All vehicles are professionally sanitized and fully insured for your peace of mind</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
