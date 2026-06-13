import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plateNumber: '', vehicleType: 'bus', capacity: '', model: '', color: '', year: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/vehicles', form);
      toast.success('Vehicle registered! Waiting for controller approval.');
      navigate('/driver');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Register Vehicle</h1>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>
          Add your vehicle to start creating trips
        </p>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Vehicle Type</label>
            <select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} style={inputStyle}>
              {['bus', 'minibus', 'taxi', 'minivan', 'coach', 'shuttle'].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Plate Number</label>
            <input type="text" required value={form.plateNumber} placeholder="e.g. AA 12345"
              onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Model / Brand</label>
              <input type="text" required value={form.model} placeholder="e.g. Isuzu NPR"
                onChange={(e) => setForm({ ...form, model: e.target.value })} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Color</label>
              <input type="text" required value={form.color} placeholder="e.g. Blue"
                onChange={(e) => setForm({ ...form, color: e.target.value })} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Seat Capacity</label>
              <input type="number" required min="1" max="100" value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Year of Manufacture</label>
              <input type="number" required min="1990" max={new Date().getFullYear()} value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? 'Registering...' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyle  = { maxWidth: 540, margin: '40px auto', padding: '0 24px' };
const cardStyle  = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '36px 32px' };
const fieldStyle = { marginBottom: 16 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1e293b' };
const submitBtn  = { width: '100%', padding: '13px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 };
