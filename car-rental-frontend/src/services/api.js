const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiRequest('/auth/me'),

  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
};

// Cars API calls
export const carsAPI = {
  getAllCars: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/cars${queryParams ? `?${queryParams}` : ''}`);
  },

  getCarById: (id) => apiRequest(`/cars/${id}`),

  createCar: (carData) => apiRequest('/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  }),

  updateCar: (id, carData) => apiRequest(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  }),

  deleteCar: (id) => apiRequest(`/cars/${id}`, {
    method: 'DELETE',
  }),

  addReview: (carId, reviewData) => apiRequest(`/cars/${carId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  checkAvailability: (carId, dates) => apiRequest(`/cars/availability/${carId}`, {
    method: 'POST',
    body: JSON.stringify(dates),
  }),
};

// Bookings API calls
export const bookingsAPI = {
  getAllBookings: () => apiRequest('/bookings'),

  getBookingById: (id) => apiRequest(`/bookings/${id}`),

  createBooking: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  updateBookingStatus: (id, status) => apiRequest(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  updatePaymentStatus: (id, paymentStatus) => apiRequest(`/bookings/${id}/payment`, {
    method: 'PUT',
    body: JSON.stringify({ paymentStatus }),
  }),

  addBookingReview: (id, reviewData) => apiRequest(`/bookings/${id}/review`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  getBookingStats: () => apiRequest('/bookings/stats/dashboard'),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => apiRequest('/users'),

  getUserById: (id) => apiRequest(`/users/${id}`),

  updateUser: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  deleteUser: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),

  getUserBookings: (id) => apiRequest(`/users/${id}/bookings`),

  getUserStats: (id) => apiRequest(`/users/${id}/stats`),

  verifyUser: (id) => apiRequest(`/users/${id}/verify`, {
    method: 'PUT',
  }),

  getUserDashboardStats: () => apiRequest('/users/stats/dashboard'),
};

export default {
  authAPI,
  carsAPI,
  bookingsAPI,
  usersAPI,
};
