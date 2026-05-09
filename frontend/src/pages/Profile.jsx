import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.profileDetails?.bio || '', location: user?.profileDetails?.location || '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.patch('/users/me', { name: form.name, profileDetails: { bio: form.bio, location: form.location } });
      setMsg('Profile updated!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-4 sm:p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Profile</h2>
      {msg && <div className="text-green-600 mb-2" role="alert">{msg}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Profile form">
        <input name="name" placeholder="Name" aria-label="Name" value={form.name} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
        <input name="bio" placeholder="Bio" aria-label="Bio" value={form.bio} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
        <input name="location" placeholder="Location" aria-label="Location" value={form.location} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded focus:ring-2 focus:ring-blue-400">Save</button>
      </form>
    </main>
  );
};

export default Profile;
