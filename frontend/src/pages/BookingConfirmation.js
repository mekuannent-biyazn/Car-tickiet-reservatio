import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../store/slices/bookingSlice';
import { toast } from 'react-toastify';

export default function BookingConfirmation() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { loading } = useSelector((s) => s.bookings);

  const { trip, selectedSeats } = state || {};

  const [passengers, setPassengers] = useState(
    selectedSeats?.map((seatNum) => ({
      seatNumber: seatNum, firstName: '', lastName: '', idNumber: '', age: '',
    })) || []
  );
  const [paymentMethod, setPaymentMethod] = useState('cash');

  if (!trip || !selectedSeats) {
    navigate('/'); return null;
  }

  const updatePassenger = (index, field, value) => {
    setPassengers((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const p of passengers) {
      if (!p.firstName || !p.lastName) {
        toast.error('Please fill all passenger names'); return;
      }
    }

    const result = await dispatch(createBooking({
      tripId: trip._id,
      passengers: passengers.map((p) => ({ ...p, age: p.age ? Number(p.age) : undefined })),
      paymentMethod,
    }));

    if (createBooking.fulfilled.match(result)) {
      toast.success('Booking confirmed! 🎉');
      navigate('/my-bookings');
    } else {
      toast.error(result.payload || 'Booking failed');
    }
  };

  const totalPrice = trip.price * selectedSeats.length;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Confirm Booking</h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>
        {trip.route?.origin} → {trip.route?.destination}
      </p>

      {/* Trip summary */}
      <div style={summaryCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={summaryLabel}>Vehicle</div>
            <div style={summaryVal}>{trip.vehicle?.vehicleType} · {trip.vehicle?.plateNumber}</div>
          </div>
          <div>
            <div style={summaryLabel}>Departure</div>
            <div style={summaryVal}>{new Date(trip.departureTime).toLocaleString()}</div>
          </div>
          <div>
            <div style={summaryLabel}>Seats</div>
            <div style={summaryVal}>{selectedSeats.join(', ')}</div>
          </div>
          <div>
            <div style={summaryLabel}>Total Price</div>
            <div style={{ ...summaryVal, fontSize: 22, color: '#1a56db', fontWeight: 800 }}>
              ETB {totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Passenger forms */}
        {passengers.map((p, i) => (
          <div key={p.seatNumber} style={passengerCard}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1a56db' }}>
              Passenger — Seat {p.seatNumber}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input type="text" required value={p.firstName} placeholder="First name"
                  onChange={(e) => updatePassenger(i, 'firstName', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input type="text" required value={p.lastName} placeholder="Last name"
                  onChange={(e) => updatePassenger(i, 'lastName', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ID / Passport Number</label>
                <input type="text" value={p.idNumber} placeholder="Optional"
                  onChange={(e) => updatePassenger(i, 'idNumber', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" min="1" max="120" value={p.age} placeholder="Optional"
                  onChange={(e) => updatePassenger(i, 'age', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        ))}

        {/* Payment */}
        <div style={passengerCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Payment Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {['cash', 'mobile_money', 'bank_transfer', 'online'].map((method) => (
              <button key={method} type="button"
                onClick={() => setPaymentMethod(method)}
                style={{
                  padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: paymentMethod === method ? '2px solid #1a56db' : '2px solid #e2e8f0',
                  background: paymentMethod === method ? '#eff6ff' : '#fff',
                  color: paymentMethod === method ? '#1a56db' : '#64748b',
                }}
              >
                {method === 'cash' ? '💵 Cash' :
                 method === 'mobile_money' ? '📱 Mobile Money' :
                 method === 'bank_transfer' ? '🏦 Bank Transfer' : '💳 Online'}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Processing...' : `Confirm & Book — ETB ${totalPrice.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}

const summaryCard = {
  background: '#eff6ff', border: '1px solid #bfdbfe',
  borderRadius: 14, padding: 20, marginBottom: 24,
};
const passengerCard = {
  background: '#fff', border: '1px solid #e2e8f0',
  borderRadius: 14, padding: 24, marginBottom: 16,
};
const summaryLabel = { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' };
const summaryVal   = { fontSize: 15, fontWeight: 600, marginTop: 4 };
const labelStyle   = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 };
const inputStyle   = {
  width: '100%', padding: '10px 13px',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, outline: 'none', color: '#1e293b',
};
const submitBtn = {
  width: '100%', padding: '15px', background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
  marginTop: 8,
};
