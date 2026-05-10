import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Tourist', bio: '', location: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        profileDetails: { bio: form.bio, location: form.location },
      });
      login(res.data.token, res.data.role);
      if (res.data.role === 'Tourist') navigate('/dashboard/tourist');
      else if (res.data.role === 'Guide') navigate('/dashboard/guide');
      else navigate('/dashboard/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl bg-white border border-gray-200 shadow-sm rounded-[2rem] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-3">Join the community</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Create your guide profile</h1>
            <p className="text-gray-600 mt-3">Sign up to lead tours, connect with travelers, or book unforgettable experiences.</p>
          </div>
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Register form">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-gray-700 font-medium">Name</span>
                <input
                  name="name"
                  placeholder="Your name"
                  aria-label="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-gray-700 font-medium">Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  aria-label="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Role</span>
                <select
                  name="role"
                  aria-label="Role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Tourist">Tourist</option>
                  <option value="Guide">Guide</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-gray-700 font-medium">Bio</span>
              <input
                name="bio"
                placeholder="Tell travelers about yourself"
                aria-label="Bio"
                value={form.bio}
                onChange={handleChange}
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
            <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-600/30">
              Register Account
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
