import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TouristDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my-bookings').then(res => setBookings(res.data));
  }, []);

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'Approved').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
  }), [bookings]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 md:ml-72">
        <Navbar />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Traveler dashboard</p>
                <h1 className="text-3xl font-extrabold text-slate-900">My Bookings</h1>
                <p className="text-slate-600 mt-2">Manage your upcoming tours and review current booking status instantly.</p>
              </div>
              <div className="rounded-3xl bg-blue-50 px-5 py-4 text-blue-700">
                <p className="text-sm">Welcome back,</p>
                <p className="text-lg font-semibold">{user?.name || 'Traveler'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="rounded-[2rem] border border-slate-300 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Total bookings</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-300 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Upcoming</p>
              <p className="mt-4 text-3xl font-extrabold text-emerald-600">{stats.upcoming}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-300 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Pending</p>
              <p className="mt-4 text-3xl font-extrabold text-amber-600">{stats.pending}</p>
            </div>
          </div>

          <div className="grid gap-6">
            {bookings.length > 0 ? bookings.map(b => (
              <div key={b._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{b.tourId?.title}</p>
                  <p className="text-sm text-slate-500">Booked on {new Date(b.bookingDate).toLocaleDateString()}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-2">Status: <strong className="text-slate-900">{b.status}</strong></span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Payment: <strong className="text-slate-900">{b.paymentStatus}</strong></span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Date: <strong className="text-slate-900">{new Date(b.bookingDate).toLocaleDateString()}</strong></span>
                </div>
              </div>
            )) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No bookings found. Explore tours to start your next adventure.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TouristDashboard;
