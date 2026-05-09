import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => (
  <>
    <Navbar />
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Find Your Perfect Local Guide</h1>
      <form className="flex gap-2 mb-8">
        <input type="text" placeholder="Search location..." className="border p-2 rounded w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/tours?category=Adventure" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100">Adventure</Link>
        <Link to="/tours?category=Culture" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100">Culture</Link>
        <Link to="/tours?category=Nature" className="p-4 bg-blue-50 rounded shadow hover:bg-blue-100">Nature</Link>
      </div>
    </div>
  </>
);

export default Home;
