import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const vehicleIcons = {
  bus:      { icon: '🚌', label: 'Bus' },
  minibus:  { icon: '🚐', label: 'Minibus' },
  taxi:     { icon: '🚕', label: 'Taxi' },
  minivan:  { icon: '🚗', label: 'Minivan' },
  coach:    { icon: '🏎️', label: 'Coach' },
  shuttle:  { icon: '🚎', label: 'Shuttle' },
};

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ origin: '', destination: '', date: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.origin || !form.destination) return;
    const params = new URLSearchParams(form).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0e3fa5 60%, #1e40af 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          Book Your Journey Online
        </h1>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Search buses, taxis, minibuses and more. Reserve your seat from home.
        </p>

        {/* Search Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          maxWidth: 700,
          margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textAlign: 'left' }}>
                  FROM
                </label>
                <input
                  type="text"
                  placeholder="Departure city"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textAlign: 'left' }}>
                  TO
                </label>
                <input
                  type="text"
                  placeholder="Destination city"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textAlign: 'left' }}>
                  DATE
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                />
              </div>
              <button type="submit" style={{
                backgroundColor: '#1a56db',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                height: 44,
              }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Vehicle types */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          All Vehicle Types
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 40 }}>
          We support all passenger transport services
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
          {Object.entries(vehicleIcons).map(([key, v]) => (
            <div key={key} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: '28px 16px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s',
              cursor: 'default',
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{v.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{v.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#f1f5f9', padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '1', title: 'Search', desc: 'Enter your origin, destination, and travel date', icon: '🔍' },
              { step: '2', title: 'Choose', desc: 'Pick your preferred vehicle, time, and available seats', icon: '🎯' },
              { step: '3', title: 'Fill Details', desc: 'Enter passenger information for each seat', icon: '📝' },
              { step: '4', title: 'Confirm', desc: 'Get your ticket code instantly, travel with ease', icon: '✅' },
            ].map((item) => (
              <div key={item.step} style={{
                background: '#fff',
                borderRadius: 14,
                padding: 28,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#1a56db', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, margin: '0 auto 12px',
                }}>{item.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  color: '#1e293b',
};
