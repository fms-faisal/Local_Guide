import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900">Local Guide</Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
          <span className="text-slate-500">{open ? 'Close' : 'Open'}</span>
        </button>

        <div className={`w-full flex-col gap-3 md:flex md:w-auto md:flex-row md:items-center ${open ? 'flex' : 'hidden'}`}>
          <Link to="/tours" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">Tours</Link>
          {!user && (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">Login</Link>
              <Link to="/register" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">Register</Link>
            </>
          )}
          {user?.role === 'Tourist' && <Link to="/dashboard/tourist" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">My Dashboard</Link>}
          {user?.role === 'Guide' && <Link to="/dashboard/guide" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">Guide Dashboard</Link>}
          {user?.role === 'Admin' && <Link to="/dashboard/admin" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3">Admin Dashboard</Link>}
          {user && (
            <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 md:px-3">Logout</button>
          )}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:px-3"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
