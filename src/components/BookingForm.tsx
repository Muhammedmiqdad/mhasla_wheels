// src/components/BookingForm.tsx
import { useState } from 'react';

type FormState = {
  name: string;
  phone: string;
  email: string;
  ride_date: string;
  ride_type: string;
  pickup_location: string;
  drop_time: string;
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '', ride_date: '', ride_type: 'private', pickup_location: '', drop_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const validate = () => {
    if (!form.name || !form.phone || !form.ride_date || !form.pickup_location) {
      setResult({ success: false, message: 'Please fill required fields.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch('/.netlify/functions/createBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: `Booking submitted. ID: ${data.booking_id}` });
        setForm({ name:'', phone:'', email:'', ride_date:'', ride_type:'private', pickup_location:'', drop_time:''});
      } else {
        setResult({ success: false, message: data.error || 'Submission failed.' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Network error.' });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input"/>
      <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input"/>
      <input placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input"/>
      <input type="date" required value={form.ride_date} onChange={e=>setForm({...form,ride_date:e.target.value})} className="input"/>
      <select value={form.ride_type} onChange={e=>setForm({...form,ride_type:e.target.value})} className="input">
        <option value="private">Private</option>
        <option value="shared">Shared</option>
        <option value="seat">Seat</option>
        <option value="one-way">One Way</option>
        <option value="return">Return</option>
      </select>
      <input placeholder="Pickup location" required value={form.pickup_location} onChange={e=>setForm({...form,pickup_location:e.target.value})} className="input"/>
      <input placeholder="Drop time (optional)" value={form.drop_time} onChange={e=>setForm({...form,drop_time:e.target.value})} className="input"/>
      <div className="flex items-center space-x-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Submitting...' : 'Book'}
        </button>
        {result && <p className={`ml-4 ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.message}</p>}
      </div>
    </form>
  );
}
