import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.role);
      if (res.data.role === 'Tourist') navigate('/dashboard/tourist');
      else if (res.data.role === 'Guide') navigate('/dashboard/guide');
      else navigate('/dashboard/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg bg-white border border-gray-200 shadow-sm rounded-[2rem] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-3">Welcome back</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Login to your account</h1>
            <p className="text-gray-600 mt-3">Access your dashboard, manage bookings, and discover new experiences.</p>
          </div>
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
            <label className="block">
              <span className="text-gray-700 font-medium">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-medium">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                aria-label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/30">
              Login
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
