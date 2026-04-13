import axios from 'axios';

const API = axios.create({
  baseURL: 'https://book-my-show-backend-bejg.vercel.app',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url === '/auth/login';
    if (error.response && error.response.status === 401 && !isLoginRoute) {
      console.warn('Unauthorized! Logging out...');
      localStorage.removeItem('bms_token');
      localStorage.removeItem('bms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ─── User Profile ────────────────────────────────────────────────
export const getUserProfile = (userId) => API.get(`/auth/profile/${userId}`);
export const updateUserProfile = (userId, data) => API.put(`/auth/profile/${userId}`, data);

// ─── Movies ──────────────────────────────────────────────────────
export const getAllMovies = () => API.get('/movies');

// ─── Shows ───────────────────────────────────────────────────────
export const getAllShows = () => API.get('/shows');
export const getShowsByMovie = (movieId) => API.get(`/shows/movie/${movieId}`);

// ─── Theatres ────────────────────────────────────────────────────
export const getAllTheatres = () => API.get('/theatres');

// ─── Seats ───────────────────────────────────────────────────────
export const getSeatsForShow = (showId) => API.get(`/seats/show/${showId}`);
export const updateSeatStatus = (seatId, status) =>
  API.put(`/seats/${seatId}/status`, { status });

// ─── Bookings ────────────────────────────────────────────────────
export const createBooking = (data) => API.post('/bookings', data);
export const getBookingsByUser = (userId) => API.get(`/bookings/user/${userId}`);
export const cancelBooking = (bookingId) => API.delete(`/bookings/${bookingId}`);

// ─── Payments ────────────────────────────────────────────────────
export const processPayment = (data) => API.post('/payments', data);
export const getPaymentByBooking = (bookingId) =>
  API.get(`/payments/booking/${bookingId}`);

// ─── Tickets ─────────────────────────────────────────────────────
export const generateTicket = (data) => API.post('/tickets', data);
export const getTicketByBooking = (bookingId) =>
  API.get(`/tickets/booking/${bookingId}`);

// ─── Stats ───────────────────────────────────────────────────────
export const getStats = () => API.get('/stats');

export default API;
