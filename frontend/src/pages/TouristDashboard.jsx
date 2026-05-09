import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TouristDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my-bookings').then(res => setBookings(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-2 sm:px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">My Bookings</h1>
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="border rounded p-4 bg-white shadow flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div className="font-bold">{b.tourId?.title}</div>
              <div>Status: <span className="font-semibold">{b.status}</span></div>
              <div>Payment: <span className="font-semibold">{b.paymentStatus}</span></div>
              <div>Booking Date: {new Date(b.bookingDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default TouristDashboard;
