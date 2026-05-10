
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
      <main className="bg-gray-50 min-h-screen pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="rounded-[2rem] border border-gray-200 bg-white shadow-sm p-8 sm:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-blue-600 uppercase tracking-[0.35em] mb-3">Curated local experiences</p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Discover premium tours guided by locals</h1>
              <p className="text-gray-600 text-base sm:text-lg mx-auto max-w-2xl">
                Filter by destination, language, date, and rating to find the perfect guided experience for your next trip.
              </p>
            </div>

            <form onSubmit={handleFilter} aria-label="Filter tours" className="mt-10 grid gap-4 lg:grid-cols-[repeat(2,minmax(0,1fr))_320px] items-end">
              <input
                name="location"
                placeholder="Location"
                aria-label="Location"
                value={filters.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                name="language"
                placeholder="Language"
                aria-label="Language"
                value={filters.language}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                name="price"
                type="number"
                placeholder="Max Price"
                aria-label="Max Price"
                value={filters.price}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                name="date"
                type="date"
                aria-label="Available Date"
                value={filters.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              <select
                name="rating"
                aria-label="Minimum Rating"
                value={filters.rating}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Min Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-8 py-3 text-white font-medium shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-600/30"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-2">Tours</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Available Tours</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">Handpicked experiences powered by local guides and immersive stories.</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 px-5 py-3 shadow-sm text-sm text-gray-600">
              {loading && tours.length === 0 ? 'Loading tours...' : `${tours.length} tours visible`}
            </div>
          </div>

          {loading && tours.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-16 flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map(tour => <TourCard key={tour._id} tour={tour} />)}
              </div>
              {hasMore && !loading && (
                <div className="flex justify-center mt-8">
                  <button onClick={handleLoadMore} className="rounded-2xl bg-blue-600 px-8 py-3 text-white font-medium shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-600/30">
                    Load More
                  </button>
                </div>
              )}
              {loading && tours.length > 0 && (
                <div className="flex justify-center mt-6"><Spinner /></div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default TourListings;
