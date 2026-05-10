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
    <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Your profile</p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">Manage your account</h1>
          <p className="mt-4 text-slate-600">Keep your profile up to date so guides and travelers can connect with you easily.</p>
        </div>
        {msg && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 mb-6" role="alert">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Profile form">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              name="name"
              placeholder="Full name"
              aria-label="Name"
              value={form.name}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Bio</span>
            <textarea
              name="bio"
              placeholder="Tell us something about yourself"
              aria-label="Bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Location</span>
            <input
              name="location"
              placeholder="City or region"
              aria-label="Location"
              value={form.location}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20"
          >
            Save Profile
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
