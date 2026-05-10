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
      <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-500">Join the community</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Create your guide profile</h1>
              <p className="mt-4 text-slate-600">Sign up to lead tours, connect with travelers, or book unforgettable experiences.</p>
            </div>
            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 mb-6" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Register form">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Name</span>
                  <input
                    name="name"
                    placeholder="Your name"
                    aria-label="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    aria-label="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Password</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    aria-label="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Role</span>
                  <select
                    name="role"
                    aria-label="Role"
                    value={form.role}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Tourist">Tourist</option>
                    <option value="Guide">Guide</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Bio</span>
                <input
                  name="bio"
                  placeholder="Tell travelers about yourself"
                  aria-label="Bio"
                  value={form.bio}
                  onChange={handleChange}
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
              <button type="submit" className="w-full rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Register Account</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
