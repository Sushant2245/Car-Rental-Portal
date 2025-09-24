import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, bookingsAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-4567',
    countryCode: '+91',
    address: '123 Main St, New York, NY 10001',
    memberSince: '2023',
    totalBookings: 12,
    activeBookings: 2
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    countryCode: user.countryCode,
    address: user.address
  });

  const countryCodes = [
    { code: '+1', abbr: 'US' },
    { code: '+1', abbr: 'CA' },
    { code: '+44', abbr: 'UK' },
    { code: '+91', abbr: 'IN' },
    { code: '+86', abbr: 'CN' },
    { code: '+81', abbr: 'JP' },
    { code: '+49', abbr: 'DE' },
    { code: '+33', abbr: 'FR' },
    { code: '+39', abbr: 'IT' },
    { code: '+34', abbr: 'ES' },
    { code: '+7', abbr: 'RU' },
    { code: '+55', abbr: 'BR' },
    { code: '+52', abbr: 'MX' },
    { code: '+61', abbr: 'AU' },
    { code: '+82', abbr: 'KR' },
    { code: '+65', abbr: 'SG' },
    { code: '+60', abbr: 'MY' },
    { code: '+66', abbr: 'TH' },
    { code: '+84', abbr: 'VN' },
    { code: '+62', abbr: 'ID' },
    { code: '+63', abbr: 'PH' },
    { code: '+92', abbr: 'PK' },
    { code: '+880', abbr: 'BD' },
    { code: '+94', abbr: 'LK' },
    { code: '+977', abbr: 'NP' },
    { code: '+971', abbr: 'AE' },
    { code: '+966', abbr: 'SA' },
    { code: '+90', abbr: 'TR' },
    { code: '+20', abbr: 'EG' },
    { code: '+27', abbr: 'ZA' },
    { code: '+234', abbr: 'NG' },
    { code: '+254', abbr: 'KE' },
    { code: '+212', abbr: 'MA' },
    { code: '+213', abbr: 'DZ' },
    { code: '+216', abbr: 'TN' },
    { code: '+98', abbr: 'IR' },
    { code: '+964', abbr: 'IQ' },
    { code: '+972', abbr: 'IL' },
    { code: '+962', abbr: 'JO' },
    { code: '+961', abbr: 'LB' },
    { code: '+46', abbr: 'SE' },
    { code: '+47', abbr: 'NO' },
    { code: '+45', abbr: 'DK' },
    { code: '+358', abbr: 'FI' },
    { code: '+31', abbr: 'NL' },
    { code: '+32', abbr: 'BE' },
    { code: '+41', abbr: 'CH' },
    { code: '+43', abbr: 'AT' },
    { code: '+48', abbr: 'PL' },
    { code: '+420', abbr: 'CZ' },
    { code: '+36', abbr: 'HU' }
  ];

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user data and bookings from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (!isAuthenticated || !authUser) {
          // Use sample data if not authenticated
          setUser({
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-4567',
            countryCode: '+91',
            address: '123 Main St, New York, NY 10001',
            memberSince: '2023',
            totalBookings: 0,
            activeBookings: 0
          });
          setRecentBookings([]);
          setError('Please login to view your bookings');
          return;
        }

        // Use authenticated user data
        const userData = authUser;
        
        // Fetch user bookings
        console.log('Fetching bookings for authenticated user...');
        const bookingsResponse = await bookingsAPI.getAllBookings();
        console.log('Bookings response:', bookingsResponse);
        const bookingsData = bookingsResponse.data || bookingsResponse.bookings || bookingsResponse || [];
        
        // Transform user data
        const transformedUser = {
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          phone: userData.phone || 'Not provided',
          countryCode: '+91', // Default or from userData
          address: userData.address ? 
            `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Not provided'
            : 'Not provided',
          memberSince: userData.createdAt ? new Date(userData.createdAt).getFullYear().toString() : '2024',
          totalBookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
          activeBookings: Array.isArray(bookingsData) ? bookingsData.filter(b => b.status === 'active' || b.status === 'confirmed').length : 0
        };

        // Transform bookings data
        const transformedBookings = Array.isArray(bookingsData) && bookingsData.length > 0 ? 
          bookingsData.slice(0, 3).map(booking => ({
            id: booking._id,
            carName: `${booking.car?.make || 'Car'} ${booking.car?.model || ''}`.trim(),
            bookingDate: new Date(booking.startDate).toLocaleDateString(),
            returnDate: new Date(booking.endDate).toLocaleDateString(),
            status: booking.status === 'active' ? 'Active' : 
                    booking.status === 'completed' ? 'Completed' : 
                    booking.status === 'cancelled' ? 'Cancelled' : 'Pending',
            amount: `$${booking.totalAmount}`,
            image: booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
          })) : [];

        setUser(transformedUser);
        setRecentBookings(transformedBookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Using sample data.');
        
        // Fallback to sample data
        setUser({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '123-4567',
          countryCode: '+91',
          address: '123 Main St, New York, NY 10001',
          memberSince: '2023',
          totalBookings: 12,
          activeBookings: 2
        });
        setRecentBookings([
          {
            id: 1,
            carName: 'Toyota Camry',
            bookingDate: '2024-01-15',
            returnDate: '2024-01-20',
            status: 'Active',
            amount: '$225',
            image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, authUser, refreshKey]);

  const handleNewBooking = () => {
    navigate('/car-listing');
  };

  const handleRefreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      address: user.address
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      countryCode: editForm.countryCode,
      address: editForm.address
    }));
    setIsEditModalOpen(false);
  };


  const handleViewHistory = () => {
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  const handleSupport = () => {
    setIsSupportModalOpen(true);
  };

  const handleCloseSupportModal = () => {
    setIsSupportModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}! Manage your rentals and bookings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{user.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-gray-800">{user.activeBookings}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Member Since</p>
                <p className="text-3xl font-bold text-gray-800">{user.memberSince}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleRefreshData}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      title="Refresh bookings"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500 flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Loading bookings...
                    </div>
                  </div>
                ) : error && !isAuthenticated ? (
                  <div className="text-center py-8">
                    <div className="text-yellow-600 mb-2">⚠️ Please login to view your bookings</div>
                    <p className="text-gray-500 text-sm">Sign in to see your rental history and active bookings</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">🚗</div>
                    <h3 className="text-gray-700 font-semibold mb-2">No bookings yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Start your journey by booking your first car!</p>
                    <button 
                      onClick={handleNewBooking}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      Browse Cars
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <img 
                          src={booking.image} 
                          alt={booking.carName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{booking.carName}</h3>
                          <p className="text-sm text-gray-500">
                            {booking.bookingDate} - {booking.returnDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{booking.amount}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <button 
                  onClick={handleEditProfile}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleNewBooking}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Booking</span>
                </button>
                
                <button 
                  onClick={handleViewHistory}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View History</span>
                </button>
                
                <button 
                  onClick={handleSupport}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                  <span>Support</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex space-x-2">
                    <select
                      name="countryCode"
                      value={editForm.countryCode}
                      onChange={handleInputChange}
                      className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      {countryCodes.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.code} {country.abbr}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* View History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-100">
            <div className="overflow-y-auto max-h-[90vh]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Booking History</h2>
                  <button 
                    onClick={handleCloseHistoryModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={booking.image} 
                          alt={booking.carName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{booking.carName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">Booking Date</p>
                              <p>{booking.bookingDate}</p>
                            </div>
                            <div>
                              <p className="font-medium">Return Date</p>
                              <p>{booking.returnDate}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-lg font-bold text-gray-800">{booking.amount}</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCloseHistoryModal}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-100">
            <div className="overflow-y-auto max-h-[90vh]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Support Center</h2>
                  <button 
                    onClick={handleCloseSupportModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Contact Options */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Phone Support</p>
                          <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Email Support</p>
                          <p className="text-sm text-gray-600">support@rentwheels.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="cursor-pointer hover:text-blue-600">
                        <p className="font-medium">How do I modify my booking?</p>
                      </div>
                      <div className="cursor-pointer hover:text-blue-600">
                        <p className="font-medium">What documents do I need for pickup?</p>
                      </div>
                      <div className="cursor-pointer hover:text-blue-600">
                        <p className="font-medium">How do I cancel my reservation?</p>
                      </div>
                      <div className="cursor-pointer hover:text-blue-600">
                        <p className="font-medium">What is your refund policy?</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h3 className="font-semibold text-red-800 mb-2">Emergency Assistance</h3>
                    <p className="text-sm text-red-700 mb-2">24/7 roadside assistance available</p>
                    <p className="font-bold text-red-800">Emergency: +1 (555) 911-HELP</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCloseSupportModal}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;