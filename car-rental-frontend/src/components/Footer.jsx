import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🚗</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                RentWheels
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your trusted partner for premium car rentals. Experience the freedom of the road with our extensive fleet of vehicles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-blue-400">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-blue-300">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-pink-400">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-blue-600">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-blue-400">🏠</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/car-listing" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-green-400">🚗</span>
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-purple-400">📊</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-orange-400">👤</span>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  Instant Booking
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-green-400">🛡️</span>
                  Insurance Coverage
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-blue-400">📞</span>
                  24/7 Support
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-purple-400">🌍</span>
                  Multiple Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-green-400">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-blue-400">✉️</span>
                <span>support@rentwheels.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-purple-400">📍</span>
                <span>123 Main St, City, State 12345</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors duration-300"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-300 text-center md:text-left">
              © {new Date().getFullYear()} RentWheels. All rights reserved. Made with ❤️ for car enthusiasts.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors duration-300">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
