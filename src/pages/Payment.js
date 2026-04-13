import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createBooking,
  processPayment,
  updateSeatStatus,
  generateTicket,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiCheckCircle,
} from 'react-icons/fi';

const paymentMethodOptions = [
  { key: 'Credit Card', icon: <FiCreditCard size={18} />, label: 'Credit Card' },
  { key: 'Debit Card', icon: <FiCreditCard size={18} />, label: 'Debit Card' },
  { key: 'UPI', icon: <FiSmartphone size={18} />, label: 'UPI' },
  { key: 'Net Banking', icon: <FiDollarSign size={18} />, label: 'Net Banking' },
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { show, movie, theatre, selectedSeats = [], totalAmount = 0 } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // 1. Create booking
      const bookingRes = await createBooking({
        user_id: user.id,
        show_id: show.show_id,
        total_amount: totalAmount,
      });
      const bookingId = bookingRes.data.bookingId;

      // 2. Process payment
      await processPayment({
        booking_id: bookingId,
        amount: totalAmount,
        payment_method: paymentMethod,
      });

      // 3. Update seat statuses to "booked"
      for (const seat of selectedSeats) {
        await updateSeatStatus(seat.seat_id, 'booked');
      }

      // 4. Generate tickets for each seat
      for (const seat of selectedSeats) {
        await generateTicket({
          booking_id: bookingId,
          seat_number: seat.seat_number,
          qr_code: `BMS-${bookingId}-${seat.seat_number}-${Date.now()}`,
        });
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Payment failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="page auth-page" id="payment-success">
        <div className="auth-card animate-fadeInUp" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(46, 204, 113, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <FiCheckCircle size={36} color="var(--accent-green)" />
          </div>
          <h1 className="auth-card__title" style={{ marginBottom: 12 }}>
            Booking Confirmed! 🎉
          </h1>
          <p className="auth-card__subtitle" style={{ marginBottom: 8 }}>
            Your tickets for <strong>{movie?.title}</strong> have been booked
            successfully.
          </p>
          <div
            style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              marginBottom: 24,
              textAlign: 'left',
            }}
          >
            <div className="booking-summary__row">
              <span className="booking-summary__label">Movie</span>
              <span className="booking-summary__value">{movie?.title}</span>
            </div>
            <div className="booking-summary__row">
              <span className="booking-summary__label">Theatre</span>
              <span className="booking-summary__value">{theatre?.name}</span>
            </div>
            <div className="booking-summary__row">
              <span className="booking-summary__label">Seats</span>
              <span className="booking-summary__value">
                {selectedSeats.map((s) => s.seat_number).join(', ')}
              </span>
            </div>
            <div className="booking-summary__row">
              <span className="booking-summary__label">Amount Paid</span>
              <span className="booking-summary__total">₹{totalAmount}</span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate('/bookings')}
            id="view-bookings-btn"
          >
            View My Bookings
          </button>
          <div style={{ marginTop: 16 }}>
            <button
              className="navbar__btn navbar__btn--outline"
              onClick={() => navigate('/')}
              style={{ display: 'inline-block' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No state was passed (direct URL access)
  if (!show || !movie) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-state__icon">💳</div>
          <h3 className="empty-state__title">No Booking Data</h3>
          <p className="empty-state__text">
            Please select a show and seats first.
          </p>
          <button
            className="btn-primary"
            style={{ maxWidth: 240, margin: '20px auto 0' }}
            onClick={() => navigate('/movies')}
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page container" id="payment-page">
      <div className="payment-page animate-fadeInUp">
        {/* Payment Form */}
        <div className="payment-form">
          <h2 className="payment-form__title">Choose Payment Method</h2>

          {error && (
            <div className="alert alert--error">⚠️ {error}</div>
          )}

          <div className="payment-methods" id="payment-methods">
            {paymentMethodOptions.map((pm) => (
              <button
                key={pm.key}
                className={`payment-method ${
                  paymentMethod === pm.key ? 'payment-method--active' : ''
                }`}
                onClick={() => {
                  setPaymentMethod(pm.key);
                  setError('');
                }}
                id={`pm-${pm.key.replace(/\s/g, '-').toLowerCase()}`}
              >
                {pm.icon}
                {pm.label}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={handlePayment}
            disabled={processing || !paymentMethod}
            id="confirm-payment-btn"
          >
            {processing
              ? 'Processing Payment...'
              : `Pay ₹${totalAmount}`}
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="payment-sidebar">
          <div className="payment-sidebar__card">
            <h3 className="payment-sidebar__title">Order Summary</h3>

            <div className="booking-summary__row">
              <span className="booking-summary__label">Movie</span>
              <span className="booking-summary__value">{movie?.title}</span>
            </div>
            <div className="booking-summary__row">
              <span className="booking-summary__label">Theatre</span>
              <span className="booking-summary__value">{theatre?.name}</span>
            </div>
            {show?.show_time && (
              <div className="booking-summary__row">
                <span className="booking-summary__label">Showtime</span>
                <span className="booking-summary__value">
                  {new Date(show.show_time).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
            <div className="booking-summary__row">
              <span className="booking-summary__label">Seats</span>
              <span className="booking-summary__value">
                {selectedSeats.map((s) => s.seat_number).join(', ')}
              </span>
            </div>
            <div
              className="booking-summary__row"
              style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}
            >
              <span className="booking-summary__label" style={{ fontWeight: 600 }}>
                Total
              </span>
              <span className="booking-summary__total">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
