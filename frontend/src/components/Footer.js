import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      textAlign: 'center',
      padding: '20px 24px',
      fontSize: 14,
    }}>
      <p>© {new Date().getFullYear()} RideBook — Passenger Transport Reservation System</p>
      <p style={{ marginTop: 4, fontSize: 12 }}>
        Bus · Minibus · Taxi · Coach · Shuttle — All vehicle types supported
      </p>
    </footer>
  );
}
