import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
// import Navbar from '../components/Navbar';

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

      <main className="max-w-md mx-auto mt-10 p-4 sm:p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 mb-2" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Login form">
          <input type="email" placeholder="Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded focus:outline-blue-400" required />
          <input type="password" placeholder="Password" aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded focus:outline-blue-400" required />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded focus:ring-2 focus:ring-blue-400">Login</button>
        </form>
      </main>
    </>
  );
};

export default Login;
