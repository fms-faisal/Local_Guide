
// import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
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
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1">

        <main className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Guide Dashboard</h1>
        <form onSubmit={handleCreateTour} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-2" aria-label="Create new tour">
          <h2 className="font-semibold">Create New Tour</h2>
          {error && <div className="text-red-500" role="alert">{error}</div>}
          <input name="title" placeholder="Title" aria-label="Title" value={newTour.title} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="description" placeholder="Description" aria-label="Description" value={newTour.description} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="location" placeholder="Location" aria-label="Location" value={newTour.location} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="category" placeholder="Category" aria-label="Category" value={newTour.category} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="language" placeholder="Language" aria-label="Language" value={newTour.language} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="price" type="number" placeholder="Price" aria-label="Price" value={newTour.price} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="availabilityDates" placeholder="Availability Dates (comma separated YYYY-MM-DD)" aria-label="Availability Dates" value={newTour.availabilityDates} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded focus:ring-2 focus:ring-blue-400">Create Tour</button>
        </form>
        <h2 className="font-semibold mb-2">Requested Bookings</h2>
        <div className="space-y-4 mb-6">
          {bookings.map(b => (
            <div key={b._id} className="border rounded p-4 bg-white shadow flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="w-full md:w-auto">
                <div className="font-bold">{b.tourId?.title}</div>
                <div>Status: <span className="font-semibold">{b.status}</span></div>
                <div>Tourist: {b.touristId?.name}</div>
              </div>
              {b.status === 'Pending' && (
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleApprove(b._id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded focus:ring-2 focus:ring-green-400">Approve</button>
                  <button onClick={() => handleApprove(b._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded focus:ring-2 focus:ring-red-400">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
        </main>
      </div>
    </div>
  );
};

export default GuideDashboard;
