import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/': 'Home',
  '/tours': 'Tours',
  '/dashboard/tourist': 'Tourist Dashboard',
  '/dashboard/guide': 'Guide Dashboard',
  '/dashboard/admin': 'Admin Dashboard',
  '/profile': 'Profile',
  '/login': 'Login',
  '/register': 'Register',
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  let path = '';
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-300 py-2 px-4" aria-label="Breadcrumb">
      <ol className="flex gap-2">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        {segments.map((seg, idx) => {
          path += '/' + seg;
          const isLast = idx === segments.length - 1;
          return (
            <li key={path} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold">{breadcrumbMap[path] || seg.charAt(0).toUpperCase() + seg.slice(1)}</span>
              ) : (
                <Link to={path} className="hover:underline">{breadcrumbMap[path] || seg.charAt(0).toUpperCase() + seg.slice(1)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
