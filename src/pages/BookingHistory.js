import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsByUser, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { FiFilm, FiCalendar, FiXCircle, FiMapPin } from 'react-icons/fi';

const BookingHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookingsByUser(user.id);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  if (loading)
    return (
      <div className="page">
        <Loader text="Loading your bookings..." />
      </div>
    );

  return (
    <div className="page container" id="booking-history-page">
      <div className="booking-history">
        <h1 className="booking-history__title animate-fadeInUp">
          🎟️ My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state__icon">🎬</div>
            <h3 className="empty-state__title">No Bookings Yet</h3>
            <p className="empty-state__text">
              You haven't booked any movies yet. Start exploring!
            </p>
            <button
              className="btn-primary"
              style={{ maxWidth: 240, margin: '24px auto 0' }}
              onClick={() => navigate('/movies')}
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking, idx) => (
              <div
                key={booking.booking_id}
                className="booking-item animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.08}s` }}
                id={`booking-${booking.booking_id}`}
              >
                <div className="booking-item__icon">
                  <FiFilm />
                </div>
                <div className="booking-item__details">
                  <div className="booking-item__movie">
                    {booking.movie_title || `Booking #${booking.booking_id}`}
                  </div>
                  <div className="booking-item__info">
                    <span>
                      <FiCalendar size={11} style={{ marginRight: 4 }} />
                      {new Date(booking.show_time || booking.booking_date).toLocaleString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                    <span><FiMapPin size={11} style={{ marginRight: 4 }} />{booking.theatre_name}</span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>🎫 {booking.ticket_count || 0} ticket{(booking.ticket_count || 0) !== 1 ? 's' : ''}</span>
                    <span>💺 {booking.seat_numbers || '—'}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}
                >
                  <div className="booking-item__amount">
                    ₹{booking.total_amount}
                  </div>
                  <span className="booking-item__status booking-item__status--confirmed">
                    Confirmed
                  </span>
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    disabled={cancelling === booking.booking_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(239,68,68,0.1)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 8,
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <FiXCircle size={13} />
                    {cancelling === booking.booking_id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
