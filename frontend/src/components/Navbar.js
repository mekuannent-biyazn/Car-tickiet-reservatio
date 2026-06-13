import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const styles = {
  nav: {
    backgroundColor: '#1a56db',
    padding: '0 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: '-0.5px',
  },
  links: { display: 'flex', alignItems: 'center', gap: 8 },
  link: {
    color: 'rgba(255,255,255,0.85)',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  btnPrimary: {
    backgroundColor: '#fff',
    color: '#1a56db',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnLogout: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  badge: {
    backgroundColor: '#fbbf24',
    color: '#1e293b',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 24,
    cursor: 'pointer',
  },
};

export default function Navbar() {
  const { user }   = useSelector((s) => s.auth);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'driver'     ? '/driver' :
    user?.role === 'controller' ? '/controller' : '/';

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>🚌 RideBook</Link>

        <div style={styles.links}>
          {!user && (
            <>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/login"
                style={{ ...styles.link, color: '#fff' }}>Login</Link>
              <Link to="/register">
                <button style={styles.btnPrimary}>Sign Up</button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to={dashboardPath} style={styles.link}>
                Dashboard
                <span style={styles.badge}>{user.role}</span>
              </Link>

              {user.role === 'passenger' && (
                <>
                  <Link to="/" style={styles.link}>Search</Link>
                  <Link to="/my-bookings" style={styles.link}>My Tickets</Link>
                </>
              )}

              {user.role === 'driver' && (
                <>
                  <Link to="/driver/trips/new" style={styles.link}>New Trip</Link>
                  <Link to="/driver/vehicles/new" style={styles.link}>Add Vehicle</Link>
                </>
              )}

              {user.role === 'controller' && (
                <>
                  <Link to="/controller/routes"   style={styles.link}>Routes</Link>
                  <Link to="/controller/trips"    style={styles.link}>Trips</Link>
                  <Link to="/controller/drivers"  style={styles.link}>Drivers</Link>
                  <Link to="/controller/vehicles" style={styles.link}>Vehicles</Link>
                </>
              )}

              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                Hi, {user.firstName}
              </span>
              <button style={styles.btnLogout} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
