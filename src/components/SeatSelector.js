import React from 'react';

const SeatSelector = ({ seats, selectedSeats, onSeatClick }) => {
  // Group seats by row (first character of seat_number, e.g., A1 -> A)
  const groupedSeats = {};
  seats.forEach((seat) => {
    const rowLabel = seat.seat_number.charAt(0);
    if (!groupedSeats[rowLabel]) {
      groupedSeats[rowLabel] = [];
    }
    groupedSeats[rowLabel].push(seat);
  });

  // Sort rows alphabetically
  const sortedRows = Object.keys(groupedSeats).sort();

  // Sort seats in each row by number
  sortedRows.forEach((row) => {
    groupedSeats[row].sort((a, b) => {
      const numA = parseInt(a.seat_number.slice(1), 10);
      const numB = parseInt(b.seat_number.slice(1), 10);
      return numA - numB;
    });
  });

  const isSelected = (seatId) => selectedSeats.includes(seatId);
  const isBooked = (seat) => seat.status === 'booked';

  return (
    <div>
      {/* Screen indicator */}
      <div className="screen-indicator">
        <div className="screen-indicator__line" />
        <span className="screen-indicator__label">Screen</span>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid" id="seat-grid">
        {sortedRows.map((row) => (
          <div className="seat-row" key={row}>
            <span className="seat-row__label">{row}</span>
            {groupedSeats[row].map((seat) => (
              <button
                key={seat.seat_id}
                id={`seat-${seat.seat_id}`}
                className={`seat ${
                  isBooked(seat)
                    ? 'seat--booked'
                    : isSelected(seat.seat_id)
                    ? 'seat--selected'
                    : ''
                }`}
                onClick={() => !isBooked(seat) && onSeatClick(seat)}
                disabled={isBooked(seat)}
                title={
                  isBooked(seat)
                    ? `${seat.seat_number} – Booked`
                    : `${seat.seat_number} – Available`
                }
              >
                {seat.seat_number.slice(1)}
              </button>
            ))}
            <span className="seat-row__label">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="seat-legend__item">
          <div className="seat-legend__icon seat-legend__icon--available" />
          Available
        </div>
        <div className="seat-legend__item">
          <div className="seat-legend__icon seat-legend__icon--selected" />
          Selected
        </div>
        <div className="seat-legend__item">
          <div className="seat-legend__icon seat-legend__icon--booked" />
          Booked
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
