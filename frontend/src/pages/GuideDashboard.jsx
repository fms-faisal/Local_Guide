
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const GuideDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [newTour, setNewTour] = useState({ title: '', description: '', location: '', category: '', language: '', price: '', availabilityDates: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my-bookings').then(res => setBookings(res.data));
    // If you want to use tours, uncomment and use as needed:
    // api.get('/tours').then(res => setTours(res.data.filter(t => t.guideId?._id === user?.id)));
  }, [user?.id]);

  const handleChange = e => {
    setNewTour({ ...newTour, [e.target.name]: e.target.value });
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tours', {
        ...newTour,
        price: Number(newTour.price),
        availabilityDates: newTour.availabilityDates.split(',').map(d => new Date(d.trim())),
      });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tour');
    }
  };

  const handleApprove = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Guide Dashboard</h1>
        <form onSubmit={handleCreateTour} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-2">
          <h2 className="font-semibold">Create New Tour</h2>
          {error && <div className="text-red-500">{error}</div>}
          <input name="title" placeholder="Title" value={newTour.title} onChange={handleChange} className="border p-2 rounded" required />
          <input name="description" placeholder="Description" value={newTour.description} onChange={handleChange} className="border p-2 rounded" required />
          <input name="location" placeholder="Location" value={newTour.location} onChange={handleChange} className="border p-2 rounded" required />
          <input name="category" placeholder="Category" value={newTour.category} onChange={handleChange} className="border p-2 rounded" required />
          <input name="language" placeholder="Language" value={newTour.language} onChange={handleChange} className="border p-2 rounded" required />
          <input name="price" type="number" placeholder="Price" value={newTour.price} onChange={handleChange} className="border p-2 rounded" required />
          <input name="availabilityDates" placeholder="Availability Dates (comma separated YYYY-MM-DD)" value={newTour.availabilityDates} onChange={handleChange} className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">Create Tour</button>
        </form>
        <h2 className="font-semibold mb-2">Requested Bookings</h2>
        <div className="space-y-4 mb-6">
          {bookings.map(b => (
            <div key={b._id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <div className="font-bold">{b.tourId?.title}</div>
                <div>Status: <span className="font-semibold">{b.status}</span></div>
                <div>Tourist: {b.touristId?.name}</div>
              </div>
              {b.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(b._id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={() => handleApprove(b._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GuideDashboard;
