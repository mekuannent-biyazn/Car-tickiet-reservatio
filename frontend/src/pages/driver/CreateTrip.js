import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function CreateTrip() {
  const navigate  = useNavigate();
  const [routes,   setRoutes]   = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({
    route: '', vehicle: '', departureTime: '', price: '', notes: '',
  });

  useEffect(() => {
    api.get('/routes').then((r) => setRoutes(r.data)).catch(() => {});
    api.get('/vehicles/my-vehicles').then((r) => {
      setVehicles(r.data.filter((v) => v.isApproved));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.route || !form.vehicle) {
      toast.error('Please select a route and vehicle'); return;
    }
    setLoading(true);
    try {
      await api.post('/trips', form);
      toast.success('Trip created! Controller will set the schedule.');
      navigate('/driver');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '36px 32px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create Trip</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
          Submit a new trip — the controller will confirm the schedule.
        </p>

        {vehicles.length === 0 && (
          <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 14 }}>
            ⚠️ You have no approved vehicles. Register a vehicle first.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Route</label>
            <select required value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} style={inputStyle}>
              <option value="">Select a route</option>
              {routes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.origin} → {r.destination} (ETB {r.basePrice})
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Vehicle</label>
            <select required value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} style={inputStyle}>
              <option value="">Select a vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.plateNumber} — {v.vehicleType} ({v.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Departure Date & Time</label>
            <input type="datetime-local" required value={form.departureTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setForm({ ...form, departureTime: e.target.value })} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ticket Price per Seat (ETB)</label>
            <input type="number" required min="1" value={form.price} placeholder="e.g. 150"
              onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea rows={3} value={form.notes} placeholder="Any additional information..."
              onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <button type="submit" disabled={loading || vehicles.length === 0} style={submitBtn}>
            {loading ? 'Submitting...' : 'Submit Trip'}
          </button>
        </form>
      </div>
    </div>
  );
}

const fieldStyle = { marginBottom: 16 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1e293b' };
const submitBtn  = { width: '100%', padding: '13px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 };
