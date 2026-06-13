import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../utils/api';

export default function DriverDashboard() {
  const { user }  = useSelector((s) => s.auth);
  const [stats,   setStats]   = useState(null);
  const [trips,   setTrips]   = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get('/drivers/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/trips/my-trips').then((r) => setTrips(r.data)).catch(() => {});
    api.get('/vehicles/my-vehicles').then((r) => setVehicles(r.data)).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Trips',      value: stats?.totalTrips      ?? '—', icon: '🚗', color: '#dbeafe' },
    { label: 'Scheduled',        value: stats?.scheduledTrips  ?? '—', icon: '📅', color: '#dcfce7' },
    { label: 'Completed',        value: stats?.completedTrips  ?? '—', icon: '✅', color: '#f0fdf4' },
    { label: 'Total Passengers', value: stats?.totalPassengers ?? '—', icon: '🧍', color: '#fef9c3' },
    { label: 'Revenue (ETB)',    value: stats?.totalRevenue?.toLocaleString() ?? '—', icon: '💰', color: '#fce7f3' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Driver Dashboard</h1>
        <p style={{ color: '#64748b' }}>Welcome back, {user?.firstName} {user?.lastName}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: s.color, borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <Link to="/driver/trips/new">
          <button style={actionBtn('#1a56db')}>+ Create New Trip</button>
        </Link>
        <Link to="/driver/vehicles/new">
          <button style={actionBtn('#10b981')}>+ Register Vehicle</button>
        </Link>
      </div>

      {/* My Vehicles */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={sectionTitle}>My Vehicles</h2>
        {vehicles.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No vehicles registered yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {vehicles.map((v) => (
              <div key={v._id} style={itemCard}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {v.vehicleType === 'bus' ? '🚌' : v.vehicleType === 'taxi' ? '🚕' : '🚐'}
                </div>
                <div style={{ fontWeight: 700 }}>{v.plateNumber}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{v.vehicleType} · {v.model}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{v.capacity} seats</div>
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: v.isApproved ? '#dcfce7' : '#fef9c3',
                  color: v.isApproved ? '#15803d' : '#b45309',
                }}>
                  {v.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Trips */}
      <section>
        <h2 style={sectionTitle}>Recent Trips</h2>
        {trips.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No trips yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trips.slice(0, 5).map((t) => (
              <div key={t._id} style={tripRow}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.route?.origin} → {t.route?.destination}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    {new Date(t.departureTime).toLocaleString()} · {t.vehicle?.vehicleType} {t.vehicle?.plateNumber}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: statusBg[t.status] || '#f1f5f9',
                }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const statusBg = { scheduled: '#dcfce7', boarding: '#fef9c3', 'in-transit': '#dbeafe', completed: '#f1f5f9', cancelled: '#fee2e2' };
const sectionTitle = { fontSize: 18, fontWeight: 700, marginBottom: 14 };
const itemCard = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 };
const tripRow  = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const actionBtn = (bg) => ({
  background: bg, color: '#fff', border: 'none',
  padding: '11px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
});
