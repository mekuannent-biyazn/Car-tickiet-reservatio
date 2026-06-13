import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);

  const load = () => api.get('/drivers').then((r) => setDrivers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggleStatus = async (driver) => {
    const action = driver.isActive ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${action} driver ${driver.firstName} ${driver.lastName}?`)) return;
    try {
      await api.put(`/drivers/${driver._id}/status`, { isActive: !driver.isActive });
      toast.success(`Driver ${action.toLowerCase()}d`);
      load();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Manage Drivers</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {drivers.map((d) => (
          <div key={d._id} style={rowCard}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{d.firstName} {d.lastName}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                {d.email} · {d.phone}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: d.isActive ? '#dcfce7' : '#fee2e2',
                color: d.isActive ? '#15803d' : '#b91c1c',
              }}>
                {d.isActive ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => toggleStatus(d)} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: d.isActive ? '#fee2e2' : '#dcfce7',
                color: d.isActive ? '#b91c1c' : '#15803d',
              }}>
                {d.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
        {drivers.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No drivers registered.</div>
        )}
      </div>
    </div>
  );
}

const rowCard = {
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
};
