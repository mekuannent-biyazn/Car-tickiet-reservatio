import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const vehicleIcon = { bus: '🚌', minibus: '🚐', taxi: '🚕', minivan: '🚗', coach: '🏎️', shuttle: '🚎' };

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filter,   setFilter]   = useState('all');

  const load = () => api.get('/vehicles').then((r) => setVehicles(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await api.put(`/vehicles/${id}/approve`, { isApproved });
      toast.success(`Vehicle ${isApproved ? 'approved' : 'rejected'}`);
      load();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const filtered = filter === 'all' ? vehicles
    : filter === 'pending' ? vehicles.filter((v) => !v.isApproved)
    : vehicles.filter((v) => v.isApproved);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Vehicles</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'approved'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: filter === f ? '#1a56db' : '#f1f5f9',
              color: filter === f ? '#fff' : '#475569',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map((v) => (
          <div key={v._id} style={vehicleCard}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{vehicleIcon[v.vehicleType] || '🚗'}</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{v.plateNumber}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              {v.vehicleType} · {v.model} · {v.color} · {v.year}
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{v.capacity} seats</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              Driver: <strong>{v.driver?.firstName} {v.driver?.lastName}</strong>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {!v.isApproved ? (
                <>
                  <button onClick={() => handleApprove(v._id, true)} style={approveBtn}>✓ Approve</button>
                  <span style={{ background: '#fef9c3', color: '#b45309', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    PENDING
                  </span>
                </>
              ) : (
                <>
                  <button onClick={() => handleApprove(v._id, false)} style={rejectBtn}>Revoke</button>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    APPROVED
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
            No vehicles found.
          </div>
        )}
      </div>
    </div>
  );
}

const vehicleCard = {
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
  padding: 24, textAlign: 'center',
};
const approveBtn = { background: '#dcfce7', color: '#15803d', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
const rejectBtn  = { background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
