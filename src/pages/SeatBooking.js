import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSeatsForShow } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/SeatSelector';
import Loader from '../components/Loader';

const SeatBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Passed from ShowDetails via router state
  const { show, movie, theatre } = location.state || {};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const fetchSeats = async () => {
    try {
      const res = await getSeatsForShow(showId);
      setSeats(res.data);
    } catch (err) {
      console.error('Failed to fetch seats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seat.seat_id)) {
        return prev.filter((id) => id !== seat.seat_id);
      }
      return [...prev, seat.seat_id];
    });
  };

  const selectedSeatDetails = seats.filter((s) =>
    selectedSeats.includes(s.seat_id)
  );

  const pricePerSeat = show?.price || 0;
  const totalAmount = selectedSeats.length * pricePerSeat;

  const handleProceedToPayment = () => {
    navigate('/payment', {
      state: {
        show,
        movie,
        theatre,
        selectedSeats: selectedSeatDetails,
        totalAmount,
      },
    });
  };

  if (loading)
    return (
      <div className="page">
        <Loader text="Loading seats..." />
      </div>
    );

  return (
    <div className="page container" id="seat-booking-page">
      <div className="seat-booking">
        <div className="seat-booking__header animate-fadeInUp">
          <h1 className="seat-booking__title">
            {movie?.title || 'Select Your Seats'}
          </h1>
          <p className="seat-booking__subtitle">
            {theatre?.name && `${theatre.name}`}
            {show?.show_time &&
              ` • ${new Date(show.show_time).toLocaleString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
          </p>
        </div>

        {seats.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state__icon">💺</div>
            <h3 className="empty-state__title">No Seats Available</h3>
            <p className="empty-state__text">
              Seats haven't been configured for this show yet.
            </p>
          </div>
        ) : (
          <>
            <SeatSelector
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />

            {/* Booking Summary */}
            <div className="booking-summary animate-fadeInUp" id="booking-summary">
              <div className="booking-summary__row">
                <span className="booking-summary__label">Selected Seats</span>
                <span className="booking-summary__value">
                  {selectedSeatDetails.length > 0
                    ? selectedSeatDetails.map((s) => s.seat_number).join(', ')
                    : 'None'}
                </span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label">Price per seat</span>
                <span className="booking-summary__value">₹{pricePerSeat}</span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label">Quantity</span>
                <span className="booking-summary__value">
                  {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="booking-summary__row">
                <span className="booking-summary__label">Total Amount</span>
                <span className="booking-summary__total">₹{totalAmount}</span>
              </div>

              <button
                className="booking-summary__btn"
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToPayment}
                id="proceed-payment-btn"
              >
                {selectedSeats.length === 0
                  ? 'Select seats to continue'
                  : `Proceed to Payment — ₹${totalAmount}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeatBooking;
