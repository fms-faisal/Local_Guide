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
      <main className="max-w-md mx-auto mt-10 p-4 sm:p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && <div className="text-red-500 mb-2" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Register form">
          <input name="name" placeholder="Name" aria-label="Name" value={form.name} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="email" type="email" placeholder="Email" aria-label="Email" value={form.email} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <input name="password" type="password" placeholder="Password" aria-label="Password" value={form.password} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" required />
          <select name="role" aria-label="Role" value={form.role} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400">
            <option value="Tourist">Tourist</option>
            <option value="Guide">Guide</option>
          </select>
          <input name="bio" placeholder="Bio" aria-label="Bio" value={form.bio} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
          <input name="location" placeholder="Location" aria-label="Location" value={form.location} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded focus:ring-2 focus:ring-blue-400">Register</button>
        </form>
      </main>
    </>
  );
};

export default Register;
