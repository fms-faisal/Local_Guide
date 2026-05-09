import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full mt-12 py-6 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 px-4">
      <div>
        &copy; {new Date().getFullYear()} Local Guide Platform
      </div>
      <div className="flex gap-4">
        <Link to="/tours">Tours</Link>
        <Link to="/about">About</Link>
        <a href="mailto:support@example.com">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
