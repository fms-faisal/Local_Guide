import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = () => {
  const { user } = useAuth();
  if (!user) return null;
  let links = [];
  if (user.role === 'Admin') {
    links = [
      { to: '/dashboard/admin', label: 'Admin Dashboard' },
      { to: '/tours', label: 'Tours' },
      { to: '/profile', label: 'Profile' },
    ];
  } else if (user.role === 'Guide') {
    links = [
      { to: '/dashboard/guide', label: 'Guide Dashboard' },
      { to: '/tours', label: 'Tours' },
      { to: '/profile', label: 'Profile' },
    ];
  } else if (user.role === 'Tourist') {
    links = [
      { to: '/dashboard/tourist', label: 'My Dashboard' },
      { to: '/tours', label: 'Tours' },
      { to: '/profile', label: 'Profile' },
    ];
  }
  return (
    <aside className="hidden md:block w-56 bg-gray-100 dark:bg-gray-800 h-full p-4 border-r border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <Link key={link.to} to={link.to} className="px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 focus:ring-2 focus:ring-blue-400">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
