import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Placeholder: fetch all users and stats
    api.get('/users').then(res => setUsers(res.data));
    api.get('/stats').then(res => setStats(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Platform Statistics</h2>
          <div>Users: {stats.users || 0}</div>
          <div>Tours: {stats.tours || 0}</div>
          <div>Bookings: {stats.bookings || 0}</div>
        </div>
        <h2 className="font-semibold mb-2">All Users</h2>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="border rounded p-2 bg-white shadow flex justify-between items-center">
              <div>{u.name} ({u.role})</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
