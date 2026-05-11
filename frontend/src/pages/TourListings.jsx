
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TourCard from '../components/TourCard';
import Spinner from '../components/Spinner';

const TourListings = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', category: '', price: '', language: '', date: '', rating: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchTours = async (reset = false, pageNum = page) => {
    setLoading(true);
    const params = { page: pageNum, limit: 6 };
    if (filters.location) params.location = filters.location;
    if (filters.category) params.category = filters.category;
    if (filters.price) params.maxPrice = filters.price;
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

  useEffect(() => {
    const params = Object.fromEntries([...searchParams.entries()]);
    setFilters({
      location: params.location || '',
      category: params.category || '',
      language: params.language || '',
      date: params.date || '',
      rating: params.rating || '',
      price: params.price || ''
    });
    setPage(1);
     
  }, [searchParams]);

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
      <main className="bg-slate-50 min-h-screen pb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-20">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_46%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300 mb-3">Curated local experiences</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Discover premium tours guided by locals</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">Filter by destination, language, date, and rating to find the perfect guided experience for your next trip.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid gap-10 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Filters</p>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Refine results</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Narrow your search and discover top-rated local guides.</p>
            </div>
            <form onSubmit={handleFilter} aria-label="Filter tours" className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Destination</span>
                <input name="location" placeholder="City or region" aria-label="Location" value={filters.location} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Language</span>
                <input name="language" placeholder="Language" aria-label="Language" value={filters.language} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Max Price</span>
                <input name="price" type="number" placeholder="USD" aria-label="Max Price" value={filters.price} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Available Date</span>
                <input name="date" type="date" aria-label="Available Date" value={filters.date} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Minimum Rating</span>
                <select name="rating" aria-label="Minimum Rating" value={filters.rating} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </label>
              <button type="submit" className="mt-4 w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Apply Filters</button>
            </form>
          </aside>

          <div className="space-y-8">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Tours</p>
                <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Available tours</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Browse carefully curated local experiences with verified guides.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">{loading && tours.length === 0 ? 'Loading...' : `${tours.length} tours available`}</div>
            </div>

            {loading && tours.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
                <Spinner />
              </div>
            ) : tours.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
                <p className="text-xl font-semibold text-slate-900">No tours found</p>
                <p className="mt-3 text-slate-600">Try adjusting your filters or explore other destinations.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {tours.map(tour => <TourCard key={tour._id} tour={tour} />)}
                </div>
                {hasMore && !loading && (
                  <div className="flex justify-center">
                    <button onClick={handleLoadMore} className="rounded-3xl bg-blue-600 px-8 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Load more tours</button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default TourListings;
