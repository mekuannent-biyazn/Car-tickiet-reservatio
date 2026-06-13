import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../store/slices/bookingSlice';
import { toast } from 'react-toastify';

const statusColors = {
  confirmed:  { bg: '#dcfce7', color: '#15803d' },
  cancelled:  { bg: '#fee2e2', color: '#b91c1c' },
  pending:    { bg: '#fef9c3', color: '#b45309' },
  completed:  { bg: '#f1f5f9', color: '#475569' },
};

export default function MyBookings() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.bookings);

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const result = await dispatch(cancelBooking(id));
    if (cancelBooking.fulfilled.match(result)) {
      toast.success('Booking cancelled');
    } else {
      toast.error('Cancel failed');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
      Loading your bookings...
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My Tickets</h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>{list.length} booking{list.length !== 1 ? 's' : ''}</p>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
          <p>No bookings yet. Search for a trip to get started!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.map((booking) => {
          const sc = statusColors[booking.status] || statusColors.pending;
          return (
            <div key={booking._id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {booking.trip?.route?.origin} → {booking.trip?.route?.destination}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                    Code: <strong style={{ color: '#1a56db' }}>{booking.bookingCode}</strong>
                  </div>
                </div>
                <span style={{
                  background: sc.bg, color: sc.color,
                  padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  alignSelf: 'flex-start',
                }}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Vehicle', value: `${booking.trip?.vehicle?.vehicleType || 'N/A'} · ${booking.trip?.vehicle?.plateNumber || ''}` },
                  { label: 'Departure', value: booking.trip?.departureTime ? new Date(booking.trip.departureTime).toLocaleString() : 'N/A' },
                  { label: 'Seats', value: booking.passengers?.map((p) => p.seatNumber).join(', ') },
                  { label: 'Total Paid', value: `ETB ${booking.totalPrice?.toLocaleString()}` },
                ].map((item) => (
                  <div key={item.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Passengers */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
                  Passengers
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {booking.passengers?.map((p, i) => (
                    <span key={i} style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
                      Seat {p.seatNumber}: {p.firstName} {p.lastName}
                    </span>
                  ))}
                </div>
              </div>

              {booking.status === 'confirmed' && (
                <button onClick={() => handleCancel(booking._id)} style={cancelBtn}>
                  Cancel Booking
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#fff', border: '1px solid #e2e8f0',
  borderRadius: 16, padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};
const cancelBtn = {
  background: '#fff', color: '#ef4444', border: '1.5px solid #fca5a5',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
