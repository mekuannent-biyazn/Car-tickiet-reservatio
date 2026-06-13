import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../utils/api';

export default function ControllerDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState({ routes: 0, trips: 0, drivers: 0, vehicles: 0, bookings: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/routes'),
      api.get('/trips'),
      api.get('/drivers'),
      api.get('/vehicles'),
      api.get('/bookings'),
    ]).then(([r, t, d, v, b]) => {
      setData({
        routes:   r.data.length,
        trips:    t.data.length,
        drivers:  d.data.length,
        vehicles: v.data.length,
        bookings: b.data.length,
      });
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Routes',   value: data.routes,   icon: '🗺️', color: '#dbeafe', link: '/controller/routes' },
    { label: 'Trips',    value: data.trips,    icon: '🚌', color: '#dcfce7', link: '/controller/trips' },
    { label: 'Drivers',  value: data.drivers,  icon: '👤', color: '#fef9c3', link: '/controller/drivers' },
    { label: 'Vehicles', value: data.vehicles, icon: '🚗', color: '#fce7f3', link: '/controller/vehicles' },
    { label: 'Bookings', value: data.bookings, icon: '🎫', color: '#f0fdf4', link: '/controller/trips' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Controller Dashboard</h1>
        <p style={{ color: '#64748b' }}>Welcome, {user?.firstName}. Manage routes, trips, drivers, and schedules.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
        {statCards.map((s) => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: s.color, borderRadius: 14, padding: '24px 18px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {[
          { title: 'Manage Routes', desc: 'Add, edit, or deactivate travel routes', link: '/controller/routes', icon: '🗺️', color: '#1a56db' },
          { title: 'Schedule Trips', desc: 'Set arrival times for driver-submitted trips', link: '/controller/trips', icon: '📅', color: '#10b981' },
          { title: 'Approve Vehicles', desc: 'Review and approve driver vehicles', link: '/controller/vehicles', icon: '🚗', color: '#f59e0b' },
          { title: 'Manage Drivers', desc: 'Activate or deactivate driver accounts', link: '/controller/drivers', icon: '👤', color: '#6366f1' },
        ].map((item) => (
          <Link key={item.title} to={item.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24, cursor: 'pointer' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: item.color }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b' }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
