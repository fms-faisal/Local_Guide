import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination) params.set('location', searchDestination);
    if (searchDate) params.set('date', searchDate);
    if (searchGuests) params.set('guests', searchGuests);
    const query = params.toString();
    navigate(query ? `/tours?${query}` : '/tours');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
    <Navbar />

    <header className="relative overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-3xl text-center mx-auto">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300 mb-4">Authentic Bangladeshi experiences</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">Discover unforgettable Bangladesh tours guided by locals.</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-100 sm:text-xl">Explore heritage streets, tea gardens, mangrove safaris, and coastal sunrises with trusted local guides.</p>
        </div>

        <div className="relative mt-16 rounded-[2rem] border border-white/10 bg-white/95 px-5 py-6 shadow-2xl backdrop-blur-xl sm:px-6 lg:px-8 lg:max-w-5xl lg:mx-auto">
          <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1.4fr_1fr_1fr_0.9fr]" aria-label="Search tours">
            <label className="relative block">
              <span className="sr-only">Destination</span>
              <input
                type="text"
                placeholder="Destination"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">Date</span>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">Guests</span>
              <input
                type="number"
                min="1"
                placeholder="Guests"
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <button type="submit" className="rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/25">Search</button>
          </form>
        </div>
      </div>
    </header>

    <main className="space-y-20 py-16 px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Featured categories</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Explore the best experiences</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">Search by interest and discover local-guided tours that match your travel style.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <Link to="/tours?category=Adventure" className="group relative overflow-hidden rounded-[2rem] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-slate-950/45" />
              <div className="relative p-8 text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-100">Adventure</p>
                <h3 className="mt-4 text-2xl font-bold">Coastal and hill adventures</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100/90">Explore Bangladesh’s hidden beaches, forests, and hill country.</p>
              </div>
            </Link>
            <Link to="/tours?category=Culture" className="group relative overflow-hidden rounded-[2rem] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-slate-950/45" />
              <div className="relative p-8 text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-100">Culture</p>
                <h3 className="mt-4 text-2xl font-bold">Historic city stories</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100/90">Walk through heritage sites, local markets, and timeless traditions.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Top rated experiences</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Featured guides & tours</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">Premium local journeys designed for unforgettable moments.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: 'Sunrise city walk', subtitle: 'Local history & hidden gems', price: 89, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1200&q=80' },
            { title: 'Culinary market tour', subtitle: 'Taste authentic flavors', price: 74, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80' },
            { title: 'Coastal kayaking trip', subtitle: 'Ocean adventure with a guide', price: 129, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
          ].map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div
                className="mb-6 h-48 rounded-[1.5rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-600">{item.title}</p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-900">{item.subtitle}</h3>
                <p className="mt-4 text-slate-600">Book this premium experience with verified local guidance and small group support.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-slate-900">
                <span className="text-lg font-semibold">${item.price}</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700">Top rated</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { label: 'Verified Guides', description: 'Trusted local experts with real reviews.' },
            { label: 'Flexible bookings', description: 'Easy scheduling and transparent pricing.' },
            { label: 'Premium support', description: '24/7 customer service for peace of mind.' },
          ].map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-600">{item.label}</p>
              <p className="mt-4 text-xl font-semibold text-slate-900">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
    </div>
  );
};
export default Home;
