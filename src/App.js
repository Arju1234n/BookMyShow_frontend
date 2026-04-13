import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import ShowDetails from './pages/ShowDetails';
import SeatBooking from './pages/SeatBooking';
import Payment from './pages/Payment';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<ShowDetails />} />
          <Route path="/booking/:showId" element={<SeatBooking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
