
import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TourCard from '../components/TourCard';
import Spinner from '../components/Spinner';

const TourListings = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', price: '', language: '', date: '', rating: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTours = async (reset = false, pageNum = page) => {
    setLoading(true);
    const params = { page: pageNum, limit: 6 };
    if (filters.location) params.location = filters.location;
    if (filters.price) params.price = filters.price;
    if (filters.language) params.language = filters.language;
    if (filters.date) params.date = filters.date;
    if (filters.rating) params.rating = filters.rating;
    const res = await api.get('/tours', { params });
    if (reset) {
      setTours(res.data);
    } else {
      setTours(prev => [...prev, ...res.data]);
    }
    setHasMore(res.data.length === 6);
    setLoading(false);
  };

  useEffect(() => {
    fetchTours(true, 1);
    setPage(1);
    // eslint-disable-next-line
  }, [filters]);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = e => {
    e.preventDefault();
    fetchTours(true, 1);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTours(false, nextPage);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Available Tours</h1>
        <form className="flex flex-col sm:flex-row flex-wrap gap-2 mb-6" onSubmit={handleFilter} aria-label="Filter tours">
          <input name="location" placeholder="Location" aria-label="Location" value={filters.location} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
          <input name="language" placeholder="Language" aria-label="Language" value={filters.language} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
          <input name="price" type="number" placeholder="Max Price" aria-label="Max Price" value={filters.price} onChange={handleChange} className="border p-2 rounded w-full sm:w-32 focus:outline-blue-400" />
          <input name="date" type="date" aria-label="Available Date" value={filters.date} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400" />
          <select name="rating" aria-label="Minimum Rating" value={filters.rating} onChange={handleChange} className="border p-2 rounded focus:outline-blue-400">
            <option value="">Min Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-400">Filter</button>
        </form>
        {loading && tours.length === 0 ? (
          <Spinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tours.map(tour => <TourCard key={tour._id} tour={tour} />)}
            </div>
            {hasMore && !loading && (
              <div className="flex justify-center mt-6">
                <button onClick={handleLoadMore} className="bg-blue-600 text-white px-6 py-2 rounded focus:ring-2 focus:ring-blue-400">Load More</button>
              </div>
            )}
            {loading && tours.length > 0 && <div className="flex justify-center mt-4"><Spinner /></div>}
          </>
        )}
      </main>
    </>
  );
};

export default TourListings;
