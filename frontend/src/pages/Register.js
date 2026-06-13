import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'passenger',
  });

  useEffect(() => {
    if (user) {
      toast.success('Account created successfully!');
      if (user.role === 'driver') navigate('/driver');
      else navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    const { confirmPassword, ...data } = form;
    dispatch(register(data));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🚌</div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Join RideBook today</p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['passenger', 'driver'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              style={{
                flex: 1, padding: '10px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: form.role === r ? '2px solid #1a56db' : '2px solid #e2e8f0',
                background: form.role === r ? '#eff6ff' : '#fff',
                color: form.role === r ? '#1a56db' : '#64748b',
              }}
            >
              {r === 'passenger' ? '🧍 Passenger' : '🚗 Driver'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input type="text" value={form.firstName} required placeholder="John"
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input type="text" value={form.lastName} required placeholder="Doe"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} required placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" value={form.phone} required placeholder="+251 9XX XXX XXX"
              onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={form.password} required placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" value={form.confirmPassword} required placeholder="••••••••"
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a56db', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', padding: 24,
  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
};
const cardStyle = {
  background: '#fff', borderRadius: 20, padding: '36px 32px',
  width: '100%', maxWidth: 480, boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
};
const fieldStyle   = { marginBottom: 14 };
const labelStyle   = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 };
const inputStyle   = {
  width: '100%', padding: '10px 13px',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, outline: 'none', color: '#1e293b',
};
const btnStyle = {
  width: '100%', padding: '13px', marginTop: 6,
  background: '#1a56db', color: '#fff', border: 'none',
  borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
};
