import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
    api.get('/stats').then(res => setStats(res.data));
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
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Admin dashboard</p>
                <h1 className="text-3xl font-extrabold text-gray-900">Platform overview</h1>
                <p className="text-gray-600 mt-2">Monitor user growth, tour activity, and booking performance at a glance.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-blue-50 p-5 text-center">
                  <p className="text-sm text-blue-600">Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.users || 0}</p>
                </div>
                <div className="rounded-3xl bg-blue-50 p-5 text-center">
                  <p className="text-sm text-blue-600">Tours</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.tours || 0}</p>
                </div>
                <div className="rounded-3xl bg-blue-50 p-5 text-center">
                  <p className="text-sm text-blue-600">Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.bookings || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Users</p>
              <h2 className="text-2xl font-bold text-gray-900">All registered users</h2>
            </div>
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u._id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{u.role}</span>
                </div>
              ))}
              {users.length === 0 && <div className="text-gray-500">No users found.</div>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
