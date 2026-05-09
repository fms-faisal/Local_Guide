import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TourCard from '../components/TourCard';

const TourListings = () => {
  const [tours, setTours] = useState([]);
  const [filters, setFilters] = useState({ location: '', price: '', language: '' });

  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line
  }, []);

  const fetchTours = async () => {
    const params = {};
    if (filters.location) params.location = filters.location;
    if (filters.price) params.price = filters.price;
    if (filters.language) params.language = filters.language;
    const res = await api.get('/tours', { params });
    setTours(res.data);
  };

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = e => {
    e.preventDefault();
    fetchTours();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Available Tours</h1>
        <form className="flex gap-2 mb-6" onSubmit={handleFilter}>
          <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} className="border p-2 rounded" />
          <input name="language" placeholder="Language" value={filters.language} onChange={handleChange} className="border p-2 rounded" />
          <input name="price" type="number" placeholder="Max Price" value={filters.price} onChange={handleChange} className="border p-2 rounded w-32" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map(tour => <TourCard key={tour._id} tour={tour} />)}
        </div>
      </div>
    </>
  );
};

export default TourListings;
