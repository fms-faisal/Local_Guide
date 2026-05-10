
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useEffect, useMemo, useState } from 'react';
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

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    approved: bookings.filter(b => b.status === 'Approved').length,
  }), [bookings]);

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
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 md:ml-72">
        <Navbar />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Guide Dashboard</p>
                <h1 className="text-3xl font-extrabold text-slate-900">Manage tours and bookings</h1>
                <p className="text-slate-600 mt-2">Create new experiences and review booking requests from your travelers.</p>
              </div>
              <div className="rounded-3xl bg-blue-50 px-5 py-4 text-blue-700">
                <p className="text-sm">Logged in as</p>
                <p className="text-lg font-semibold">{user?.name || 'Guide'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Total bookings</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Pending</p>
              <p className="mt-4 text-3xl font-extrabold text-amber-600">{stats.pending}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Approved</p>
              <p className="mt-4 text-3xl font-extrabold text-emerald-600">{stats.approved}</p>
            </div>
          </div>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Create New Tour</p>
                <h2 className="text-2xl font-bold text-slate-900">Launch your next experience</h2>
              </div>
              {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 mb-6">{error}</div>}
              <form onSubmit={handleCreateTour} className="space-y-5" aria-label="Create new tour">
                <input name="title" placeholder="Title" aria-label="Title" value={newTour.title} onChange={handleChange} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                <textarea name="description" placeholder="Description" aria-label="Description" value={newTour.description} onChange={handleChange} rows={4} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="location" placeholder="Location" aria-label="Location" value={newTour.location} onChange={handleChange} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                  <input name="category" placeholder="Category" aria-label="Category" value={newTour.category} onChange={handleChange} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="language" placeholder="Language" aria-label="Language" value={newTour.language} onChange={handleChange} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                  <input name="price" type="number" placeholder="Price" aria-label="Price" value={newTour.price} onChange={handleChange} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                </div>
                <input name="availabilityDates" placeholder="Availability Dates (YYYY-MM-DD, comma separated)" aria-label="Availability Dates" value={newTour.availabilityDates} onChange={handleChange} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" required />
                <button type="submit" className="w-full rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Create Tour</button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Booking Requests</p>
                <h2 className="text-2xl font-bold text-slate-900">Manage requests</h2>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tour</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tourist</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td className="px-6 py-4 align-top text-slate-900">{b.tourId?.title}</td>
                        <td className="px-6 py-4 align-top text-slate-600">{b.touristId?.name}</td>
                        <td className="px-6 py-4 align-top">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${b.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{b.status}</span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          {b.status === 'Pending' ? (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => handleApprove(b._id, 'Approved')} className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">Approve</button>
                              <button onClick={() => handleApprove(b._id, 'Rejected')} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">Reject</button>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">No action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No booking requests found yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GuideDashboard;
