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
    <aside className="hidden md:fixed md:left-0 md:top-0 md:z-30 md:flex md:h-full md:w-72 md:flex-col md:gap-8 md:border-r md:border-slate-200 md:bg-white md:px-6 md:py-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Dashboard</p>
        <p className="mt-4 text-2xl font-extrabold text-slate-900">Control center</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {links.map(link => (
          <Link key={link.to} to={link.to} className="rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Role</p>
        <p className="mt-2">{user.role}</p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
