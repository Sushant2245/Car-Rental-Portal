import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm"
    }`;

  const handleBookNow = () => {
    navigate('/car-listing');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-white/10 backdrop-blur-lg relative z-50">
      <div className="flex justify-between h-20 items-center px-6">
        
        {/* LEFT: Logo + Brand Name */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-2xl font-bold">🚗</span>
          </div>
          <span className="text-white text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
            RentWheels
          </span>
        </NavLink>

        {/* RIGHT: Nav Links + Button */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" className={linkClasses}>
              <span className="flex items-center gap-2">
                🏠 Home
              </span>
            </NavLink>
            <NavLink to="/car-listing" className={linkClasses}>
              <span className="flex items-center gap-2">
                🚗 Browse Cars
              </span>
            </NavLink>
            <NavLink to="/dashboard" className={linkClasses}>
              <span className="flex items-center gap-2">
                📊 Dashboard
              </span>
            </NavLink>
            <NavLink to="/login" className={linkClasses}>
              <span className="flex items-center gap-2">
                👤 Login
              </span>
            </NavLink>
          </div>
          <button 
            onClick={handleBookNow}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            <span className="flex items-center gap-2">
              ⚡ Book Now
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
