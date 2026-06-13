import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ManageTrips() {
  const [trips,    setTrips]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [schedForm, setSchedForm] = useState({ arrivalTime: '', price: '', status: '', notes: '' });
  const [loading,  setLoading]  = useState(false);

  const load = () => api.get('/trips').then((r) => setTrips(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openSchedule = (trip) => {
    setSelected(trip);
    setSchedForm({
      arrivalTime: trip.arrivalTime ? new Date(trip.arrivalTime).toISOString().slice(0, 16) : '',
      price: trip.price || '',
      status: trip.status || 'scheduled',
      notes: trip.notes || '',
    });
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/trips/${selected._id}/schedule`, schedForm);
      toast.success('Trip scheduled successfully');
      setSelected(null); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  const statusBg = { scheduled: '#dcfce7', boarding: '#fef9c3', 'in-transit': '#dbeafe', completed: '#f1f5f9', cancelled: '#fee2e2' };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Manage Trips</h1>

      {/* Schedule modal */}
      {selected && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Set Schedule</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {selected.route?.origin} → {selected.route?.destination} | {selected.driver?.firstName} {selected.driver?.lastName}
            </p>
            <form onSubmit={handleSchedule}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Arrival Date & Time</label>
                <input type="datetime-local" value={schedForm.arrivalTime}
                  onChange={(e) => setSchedForm({ ...schedForm, arrivalTime: e.target.value })} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Ticket Price (ETB)</label>
                <input type="number" value={schedForm.price}
                  onChange={(e) => setSchedForm({ ...schedForm, price: e.target.value })} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Status</label>
                <select value={schedForm.status} onChange={(e) => setSchedForm({ ...schedForm, status: e.target.value })} style={inputStyle}>
                  {['scheduled', 'boarding', 'in-transit', 'completed', 'cancelled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Notes</label>
                <textarea rows={2} value={schedForm.notes}
                  onChange={(e) => setSchedForm({ ...schedForm, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading} style={submitBtn}>
                  {loading ? 'Saving...' : 'Save Schedule'}
                </button>
                <button type="button" onClick={() => setSelected(null)} style={cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {trips.map((trip) => (
          <div key={trip._id} style={rowCard}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{trip.route?.origin} → {trip.route?.destination}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span>🚗 {trip.vehicle?.vehicleType} · {trip.vehicle?.plateNumber}</span>
                <span>👤 {trip.driver?.firstName} {trip.driver?.lastName}</span>
                <span>📅 {new Date(trip.departureTime).toLocaleString()}</span>
                <span>💺 {trip.availableSeats} available</span>
                <span>💵 ETB {trip.price}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: statusBg[trip.status] || '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {trip.status}
              </span>
              <button onClick={() => openSchedule(trip)} style={schedBtn}>
                Set Schedule
              </button>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No trips found.</div>
        )}
      </div>
    </div>
  );
}

const overlay  = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 24 };
const modal    = { background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 };
const rowCard  = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' };
const fieldStyle = { marginBottom: 14 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' };
const submitBtn  = { padding: '11px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' };
const cancelBtn  = { padding: '11px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' };
const schedBtn   = { background: '#1a56db', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' };
