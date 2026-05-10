
import Navbar from '../components/Navbar';
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
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1">
        <Navbar />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Guide Dashboard</p>
                <h1 className="text-3xl font-extrabold text-gray-900">Manage tours and bookings</h1>
                <p className="text-gray-600 mt-2">Create new experiences and review booking requests from your travelers.</p>
              </div>
              <div className="rounded-3xl bg-blue-50 px-5 py-4 text-blue-700">
                <p className="text-sm">Logged in as</p>
                <p className="text-lg font-semibold">{user?.name || 'Guide'}</p>
              </div>
            </div>
          </div>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Create New Tour</p>
                  <h2 className="text-2xl font-bold text-gray-900">Launch your next experience</h2>
                </div>
              </div>
              {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-6">{error}</div>}
              <form onSubmit={handleCreateTour} className="space-y-4" aria-label="Create new tour">
                <input name="title" placeholder="Title" aria-label="Title" value={newTour.title} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                <textarea name="description" placeholder="Description" aria-label="Description" value={newTour.description} onChange={handleChange} rows={3} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="location" placeholder="Location" aria-label="Location" value={newTour.location} onChange={handleChange} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                  <input name="category" placeholder="Category" aria-label="Category" value={newTour.category} onChange={handleChange} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="language" placeholder="Language" aria-label="Language" value={newTour.language} onChange={handleChange} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                  <input name="price" type="number" placeholder="Price" aria-label="Price" value={newTour.price} onChange={handleChange} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                </div>
                <input name="availabilityDates" placeholder="Availability Dates (YYYY-MM-DD, comma separated)" aria-label="Availability Dates" value={newTour.availabilityDates} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" required />
                <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-600/30">Create Tour</button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Booking Requests</p>
                <h2 className="text-2xl font-bold text-gray-900">Manage requests</h2>
              </div>
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b._id} className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{b.tourId?.title}</p>
                        <p className="text-sm text-gray-500">Tourist: {b.touristId?.name}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{b.status}</span>
                        {b.status === 'Pending' && (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleApprove(b._id, 'Approved')} className="rounded-2xl bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 focus:ring-2 focus:ring-green-400">Approve</button>
                            <button onClick={() => handleApprove(b._1, 'Rejected')} className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 focus:ring-2 focus:ring-red-400">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="text-gray-500">No booking requests found yet.</div>}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GuideDashboard;
