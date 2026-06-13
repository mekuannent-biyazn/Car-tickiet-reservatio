import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      if (user.role === 'driver')      navigate('/driver');
      else if (user.role === 'controller') navigate('/controller');
      else navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🚌</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Sign in to your RideBook account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1a56db', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: 'calc(100vh - 120px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
};
const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 420,
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
};
const fieldStyle = { marginBottom: 18 };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, outline: 'none', color: '#1e293b',
};
const btnStyle = {
  width: '100%', padding: '13px',
  background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 10,
  fontSize: 15, fontWeight: 700, cursor: 'pointer',
  marginTop: 8,
};
