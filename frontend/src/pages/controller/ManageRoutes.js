import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const emptyForm = { origin: '', destination: '', distance: '', estimatedDuration: '', basePrice: '', stops: '' };

export default function ManageRoutes() {
  const [routes,  setRoutes]  = useState([]);
  const [form,    setForm]    = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/routes').then((r) => setRoutes(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        distance: form.distance ? Number(form.distance) : undefined,
        estimatedDuration: form.estimatedDuration ? Number(form.estimatedDuration) : undefined,
        basePrice: Number(form.basePrice),
        stops: form.stops ? form.stops.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await api.put(`/routes/${editing}`, payload);
        toast.success('Route updated');
      } else {
        await api.post('/routes', payload);
        toast.success('Route created');
      }
      setForm(emptyForm); setEditing(null); setShowForm(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving route');
    } finally { setLoading(false); }
  };

  const handleEdit = (route) => {
    setForm({
      origin: route.origin, destination: route.destination,
      distance: route.distance || '', estimatedDuration: route.estimatedDuration || '',
      basePrice: route.basePrice, stops: route.stops?.join(', ') || '',
    });
    setEditing(route._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this route?')) return;
    await api.delete(`/routes/${id}`);
    toast.success('Route deactivated'); load();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Routes</h1>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm((v) => !v); }} style={addBtn}>
          {showForm ? 'Cancel' : '+ Add Route'}
        </button>
      </div>

      {showForm && (
        <div style={formCard}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? 'Edit Route' : 'New Route'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Origin *</label>
                <input required value={form.origin} placeholder="e.g. Addis Ababa"
                  onChange={(e) => setForm({ ...form, origin: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Destination *</label>
                <input required value={form.destination} placeholder="e.g. Hawassa"
                  onChange={(e) => setForm({ ...form, destination: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Distance (km)</label>
                <input type="number" value={form.distance} placeholder="e.g. 275"
                  onChange={(e) => setForm({ ...form, distance: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Est. Duration (minutes)</label>
                <input type="number" value={form.estimatedDuration} placeholder="e.g. 240"
                  onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Base Price (ETB) *</label>
                <input required type="number" min="1" value={form.basePrice} placeholder="e.g. 150"
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stops (comma separated)</label>
                <input value={form.stops} placeholder="e.g. Adama, Ziway"
                  onChange={(e) => setForm({ ...form, stops: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={submitBtn}>
              {loading ? 'Saving...' : editing ? 'Update Route' : 'Create Route'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {routes.map((route) => (
          <div key={route._id} style={rowCard}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {route.origin} → {route.destination}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {route.distance && <span>📏 {route.distance} km</span>}
                {route.estimatedDuration && <span>⏱ {route.estimatedDuration} min</span>}
                <span>💵 ETB {route.basePrice}</span>
                {route.stops?.length > 0 && <span>📍 {route.stops.join(' · ')}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(route)} style={editBtn}>Edit</button>
              <button onClick={() => handleDelete(route._id)} style={deleteBtn}>Deactivate</button>
            </div>
          </div>
        ))}
        {routes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            No routes yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}

const addBtn    = { background: '#1a56db', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' };
const formCard  = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, marginBottom: 24 };
const rowCard   = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 };
const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' };
const submitBtn  = { marginTop: 16, padding: '12px 28px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' };
const editBtn    = { background: '#f1f5f9', color: '#475569', border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 };
const deleteBtn  = { background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 };
