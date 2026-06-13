import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchTrips } from '../store/slices/tripSlice';

const vehicleIcon = { bus: '🚌', minibus: '🚐', taxi: '🚕', minivan: '🚗', coach: '🏎️', shuttle: '🚎' };

function formatTime(dt) {
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(dt) {
  return new Date(dt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
function duration(dep, arr) {
  const mins = Math.round((new Date(arr) - new Date(dep)) / 60000);
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function SearchResults() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);
  const origin      = params.get('origin');
  const destination = params.get('destination');
  const date        = params.get('date');

  const { results, loading, error } = useSelector((s) => s.trips);

  useEffect(() => {
    dispatch(searchTrips({ origin, destination, date }));
  }, [dispatch, origin, destination, date]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          {origin} → {destination}
        </h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>
          {date ? formatDate(date) : 'All upcoming trips'} · {results.length} trip{results.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {loading && (
        <div style={loadingStyle}>
          <span style={{ fontSize: 32 }}>🔍</span>
          <p>Searching for available trips...</p>
        </div>
      )}

      {!loading && error && (
        <div style={errorStyle}>{error}</div>
      )}

      {!loading && results.length === 0 && !error && (
        <div style={emptyStyle}>
          <span style={{ fontSize: 48 }}>😔</span>
          <h3>No trips found</h3>
          <p>Try a different date or route</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {results.map((trip) => (
          <div key={trip._id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{vehicleIcon[trip.vehicle?.vehicleType] || '🚗'}</span>
              <div>
                <span style={typeBadge}>{trip.vehicle?.vehicleType?.toUpperCase()}</span>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  {trip.vehicle?.model} · {trip.vehicle?.plateNumber}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1a56db' }}>
                  ETB {trip.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>per seat</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{formatTime(trip.departureTime)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{trip.route?.origin}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                  {duration(trip.departureTime, trip.arrivalTime)}
                </div>
                <div style={{ height: 2, background: '#e2e8f0', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 10, color: '#94a3b8',
                  }}>✈</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{formatTime(trip.arrivalTime)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{trip.route?.destination}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={infoChip}>
                  💺 {trip.availableSeats} seats left
                </span>
                <span style={infoChip}>
                  👤 {trip.driver?.firstName} {trip.driver?.lastName}
                </span>
                <span style={{ ...infoChip, background: statusColors[trip.status] || '#f1f5f9' }}>
                  {trip.status}
                </span>
              </div>
              <button
                onClick={() => navigate(`/trips/${trip._id}`)}
                style={selectBtn}
              >
                Select →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusColors = {
  scheduled: '#dcfce7',
  boarding:  '#fef9c3',
  'in-transit': '#dbeafe',
  completed: '#f1f5f9',
  cancelled: '#fee2e2',
};

const cardStyle = {
  background: '#fff', borderRadius: 16, padding: 24,
  border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.2s',
};
const typeBadge = {
  background: '#dbeafe', color: '#1e40af',
  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
};
const infoChip = {
  background: '#f1f5f9', color: '#475569',
  padding: '4px 10px', borderRadius: 20, fontSize: 12,
};
const selectBtn = {
  background: '#1a56db', color: '#fff', border: 'none',
  padding: '10px 22px', borderRadius: 10, fontWeight: 700,
  fontSize: 14, cursor: 'pointer',
};
const loadingStyle = {
  textAlign: 'center', padding: '60px 0', color: '#64748b', display: 'flex',
  flexDirection: 'column', alignItems: 'center', gap: 12,
};
const emptyStyle = {
  textAlign: 'center', padding: '60px 0', color: '#64748b',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
};
const errorStyle = {
  background: '#fee2e2', color: '#b91c1c', padding: 16,
  borderRadius: 10, marginBottom: 20,
};
