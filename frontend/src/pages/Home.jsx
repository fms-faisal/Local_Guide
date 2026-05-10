import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    {/* HERO SECTION */}
    <section className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-sm text-blue-200 uppercase tracking-[0.35em] mb-4">Authentic local experiences</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Find Your Perfect <span className="text-blue-300">Local Guide</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Discover hidden gems, authentic culture, and unforgettable adventures with verified local experts in your next destination.
        </p>

        <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto focus-within:ring-4 focus-within:ring-blue-500/30 transition-all">
          <form className="flex-1 flex flex-col sm:flex-row gap-2" aria-label="Search tours by location">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Where do you want to go?" 
                aria-label="Search location" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-0 text-gray-900 placeholder-gray-500 bg-transparent text-lg outline-none" 
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>

    {/* BODY SECTION: Categories */}
    <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Whether you're seeking adrenaline, history, or peaceful landscapes, we have the perfect experience for you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Link 
          to="/tours?category=Adventure" 
          className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 focus:outline-blue-600 focus:ring-4 focus:ring-blue-600/50"
          tabIndex={0}
        >
          <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-20"></div>
          <div className="absolute bottom-6 left-6 z-30">
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform">Adventure</h3>
            <p className="text-blue-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Thrilling outdoor experiences &rarr;</p>
          </div>
        </Link>

        <Link 
          to="/tours?category=Culture" 
          className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 focus:outline-blue-600 focus:ring-4 focus:ring-blue-600/50"
          tabIndex={0}
        >
          <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-20"></div>
          <div className="absolute bottom-6 left-6 z-30">
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform">Culture</h3>
            <p className="text-indigo-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">History, food, and traditions &rarr;</p>
          </div>
        </Link>

        <Link 
          to="/tours?category=Nature" 
          className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 focus:outline-blue-600 focus:ring-4 focus:ring-blue-600/50"
          tabIndex={0}
        >
          <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-emerald-600/20 transition-colors z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-20"></div>
          <div className="absolute bottom-6 left-6 z-30">
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform">Nature</h3>
            <p className="text-emerald-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Wildlife and scenic landscapes &rarr;</p>
          </div>
        </Link>
      </div>
    </main>
  </div>
);

export default Home;
