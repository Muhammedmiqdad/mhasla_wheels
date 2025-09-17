// src/pages/AdminBookings.tsx
import { useEffect, useState } from 'react';

export default function AdminBookings() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/getBookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to fetch');
      }
    } catch (e) {
      alert('Network error');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchBookings(); }, [token]);

  const handleAction = async (booking_id: string, status: string) => {
    const reason = status === 'rejected' ? prompt('Reason (optional)') || '' : '';
    const res = await fetch('/.netlify/functions/updateBooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ booking_id, status, reason }),
    });
    if (res.ok) {
      alert('Updated');
      fetchBookings();
    } else {
      alert('Failed to update');
    }
  };

  if (!token) {
    return (
      <div className="p-6">
        <h2>Admin Login</h2>
        <input placeholder="Enter admin token" onChange={e=>setToken(e.target.value)} className="input" />
        <button onClick={()=>localStorage.setItem('admin_token', token) || window.location.reload()} className="btn-primary mt-2">Save & Reload</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Bookings</h2>
      {loading ? <p>Loading...</p> : bookings.map(b => (
        <div key={b.booking_id} className="p-4 border rounded mb-3">
          <div><strong>{b.booking_id}</strong> — {b.name} — {b.phone}</div>
          <div>Date: {new Date(b.ride_date).toLocaleDateString()}</div>
          <div>Pickup: {b.pickup_location}</div>
          <div>Status: {b.status}</div>
          <div className="mt-2 space-x-2">
            <button onClick={()=>handleAction(b.booking_id, 'confirmed')} className="btn-primary">Confirm</button>
            <button onClick={()=>handleAction(b.booking_id, 'rejected')} className="btn-ghost">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
