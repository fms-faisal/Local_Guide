import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2" aria-label="Main navigation">
      <div className="font-bold text-xl">
        <Link to="/" tabIndex={0}>Local Guide Platform</Link>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center">
        <Link to="/tours" className="hover:underline focus:outline-blue-400" tabIndex={0}>Tours</Link>
        {!user && <>
          <Link to="/login" className="hover:underline focus:outline-blue-400" tabIndex={0}>Login</Link>
          <Link to="/register" className="hover:underline focus:outline-blue-400" tabIndex={0}>Register</Link>
        </>}
        {user && user.role === 'Tourist' && <Link to="/dashboard/tourist" className="hover:underline focus:outline-blue-400" tabIndex={0}>My Dashboard</Link>}
        {user && user.role === 'Guide' && <Link to="/dashboard/guide" className="hover:underline focus:outline-blue-400" tabIndex={0}>Guide Dashboard</Link>}
        {user && user.role === 'Admin' && <Link to="/dashboard/admin" className="hover:underline focus:outline-blue-400" tabIndex={0}>Admin Dashboard</Link>}
        {user && <button onClick={logout} className="ml-2 text-red-500 focus:outline-blue-400" tabIndex={0}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
