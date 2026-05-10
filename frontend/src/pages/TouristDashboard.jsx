import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TouristDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my-bookings').then(res => setBookings(res.data));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1">
        <Navbar />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm mb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Traveler dashboard</p>
                <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-2">Manage your upcoming tours and review current booking status instantly.</p>
              </div>
              <div className="rounded-3xl bg-blue-50 px-5 py-4 text-blue-700">
                <p className="text-sm">Welcome back,</p>
                <p className="text-lg font-semibold">{user?.name || 'Traveler'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {bookings.map(b => (
              <div key={b._id} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{b.tourId?.title}</p>
                  <p className="text-sm text-gray-500">Booked on {new Date(b.bookingDate).toLocaleDateString()}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 text-sm text-gray-600">
                  <span className="rounded-full bg-gray-100 px-3 py-2">Status: <strong className="text-gray-900">{b.status}</strong></span>
                  <span className="rounded-full bg-gray-100 px-3 py-2">Payment: <strong className="text-gray-900">{b.paymentStatus}</strong></span>
                  <span className="rounded-full bg-gray-100 px-3 py-2">Date: <strong className="text-gray-900">{new Date(b.bookingDate).toLocaleDateString()}</strong></span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
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
