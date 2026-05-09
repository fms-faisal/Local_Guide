// import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => (
  <>
    <main className="max-w-3xl mx-auto py-10 px-2 sm:px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Find Your Perfect Local Guide</h1>
      <form className="flex flex-col sm:flex-row gap-2 mb-8" aria-label="Search tours by location">
        <input type="text" placeholder="Search location..." aria-label="Search location" className="border p-2 rounded w-full focus:outline-blue-400" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-400">Search</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/tours?category=Adventure" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100 focus:outline-blue-400" tabIndex={0}>Adventure</Link>
        <Link to="/tours?category=Culture" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100 focus:outline-blue-400" tabIndex={0}>Culture</Link>
        <Link to="/tours?category=Nature" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100 focus:outline-blue-400" tabIndex={0}>Nature</Link>
      </div>
    </main>
  </>
);

export default Home;
