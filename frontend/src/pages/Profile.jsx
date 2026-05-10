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
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 shadow-sm rounded-[2rem] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-3">Your profile</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage your account</h1>
          <p className="text-gray-600 mt-3">Keep your profile up to date so guides and travelers can connect with you easily.</p>
        </div>
        {msg && <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6" role="alert">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Profile form">
          <label className="block">
            <span className="text-gray-700 font-medium">Name</span>
            <input
              name="name"
              placeholder="Full name"
              aria-label="Name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Bio</span>
            <textarea
              name="bio"
              placeholder="Tell us something about yourself"
              aria-label="Bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Location</span>
            <input
              name="location"
              placeholder="City or region"
              aria-label="Location"
              value={form.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-600/30"
          >
            Save Profile
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
