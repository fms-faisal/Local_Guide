import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/">Local Guide Platform</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/tours" className="hover:underline">Tours</Link>
        {!user && <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </>}
        {user && user.role === 'Tourist' && <Link to="/dashboard/tourist" className="hover:underline">My Dashboard</Link>}
        {user && user.role === 'Guide' && <Link to="/dashboard/guide" className="hover:underline">Guide Dashboard</Link>}
        {user && user.role === 'Admin' && <Link to="/dashboard/admin" className="hover:underline">Admin Dashboard</Link>}
        {user && <button onClick={logout} className="ml-2 text-red-500">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
