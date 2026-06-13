import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrip } from '../store/slices/tripSlice';
import { toast } from 'react-toastify';

const vehicleIcon = { bus: '🚌', minibus: '🚐', taxi: '🚕', minivan: '🚗', coach: '🏎️', shuttle: '🚎' };

export default function TripDetail() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { selected: trip, loading } = useSelector((s) => s.trips);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => { dispatch(fetchTrip(id)); }, [dispatch, id]);

  const toggleSeat = (seatNum, isBooked) => {
    if (isBooked) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum]
    );
  };

  const handleBook = () => {
    if (!user) { toast.info('Please login to book tickets'); navigate('/login'); return; }
    if (user.role !== 'passenger') { toast.error('Only passengers can book tickets'); return; }
    if (selectedSeats.length === 0) { toast.warning('Please select at least one seat'); return; }

    navigate('/booking/confirm', {
      state: { trip, selectedSeats },
    });
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748b' }}>
      Loading trip details...
    </div>
  );

  if (!trip) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748b' }}>
      Trip not found
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={headerCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 48 }}>{vehicleIcon[trip.vehicle?.vehicleType] || '🚗'}</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              {trip.route?.origin} → {trip.route?.destination}
            </h1>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
              {trip.vehicle?.vehicleType?.toUpperCase()} · {trip.vehicle?.model} · {trip.vehicle?.plateNumber}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1a56db' }}>
              ETB {trip.price?.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>per seat</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { label: 'Departure', value: new Date(trip.departureTime).toLocaleString() },
            { label: 'Arrival', value: new Date(trip.arrivalTime).toLocaleString() },
            { label: 'Driver', value: `${trip.driver?.firstName} ${trip.driver?.lastName}` },
            { label: 'Available Seats', value: `${trip.availableSeats} / ${trip.seats?.length}` },
          ].map((item) => (
            <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat map */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Select Seats</h2>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { color: '#fff', border: '#e2e8f0', label: 'Available' },
            { color: '#1a56db', border: '#1a56db', label: 'Selected' },
            { color: '#fee2e2', border: '#fca5a5', label: 'Booked' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: l.color, border: `2px solid ${l.border}`,
              }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Vehicle front indicator */}
        <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 13, color: '#94a3b8' }}>
          ── FRONT ──
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 44px)', gap: 8, justifyContent: 'center' }}>
          {trip.seats?.map((seat) => {
            const isSelected = selectedSeats.includes(seat.seatNumber);
            return (
              <div
                key={seat.seatNumber}
                onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                style={{
                  width: 44, height: 44,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                  background: seat.isBooked ? '#fee2e2' : isSelected ? '#1a56db' : '#fff',
                  color:      seat.isBooked ? '#ef4444'  : isSelected ? '#fff'    : '#1e293b',
                  border: `2px solid ${seat.isBooked ? '#fca5a5' : isSelected ? '#1a56db' : '#e2e8f0'}`,
                  transition: 'all 0.15s',
                }}
              >
                {seat.seatNumber}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary + Book */}
      {selectedSeats.length > 0 && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                Selected seats: <strong>{selectedSeats.sort((a, b) => a - b).join(', ')}</strong>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1a56db', marginTop: 4 }}>
                Total: ETB {(trip.price * selectedSeats.length).toLocaleString()}
              </div>
            </div>
            <button onClick={handleBook} style={bookBtn}>
              Book {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} →
            </button>
          </div>
        </div>
      )}

      {trip.route?.stops?.length > 0 && (
        <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Stops Along the Route</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {trip.route.stops.map((stop, i) => (
              <span key={i} style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
                📍 {stop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const headerCard = {
  background: '#fff', border: '1px solid #e2e8f0',
  borderRadius: 16, padding: 28, marginBottom: 20,
};
const bookBtn = {
  background: '#1a56db', color: '#fff', border: 'none',
  padding: '14px 28px', borderRadius: 12, fontSize: 16,
  fontWeight: 700, cursor: 'pointer',
};
