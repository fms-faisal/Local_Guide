
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TourCard = ({ tour }) => {
  const { user } = useAuth();
  const [bookingMsg, setBookingMsg] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedDate, setSelectedDate] = useState(
    tour.availabilityDates?.length ? new Date(tour.availabilityDates[0]).toISOString().slice(0, 10) : ''
  );

  const fallbackImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
  const averageRating = tour.rating || tour.averageRating || 4.8;
  const stars = Array.from({ length: 5 }, (_, index) => index < Math.round(averageRating));

  const handleBook = async () => {
    setBookingMsg('');
    if (!selectedDate) {
      setBookingMsg('Please select a booking date.');
      return;
    }

    try {
      await api.post('/bookings', { tourId: tour._id, date: selectedDate });
      setBookingMsg('Booking requested!');
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post('/reviews', { tourId: tour._id, rating, comment: review });
      setReviewMsg('Review submitted!');
      setReview('');
      setRating(5);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Review failed');
    }
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <img
          src={tour.image || tour.imageUrl || fallbackImage}
          alt={tour.title || 'Tour image'}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">{tour.location || 'Global'}</span>
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">${tour.price}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500 mb-4">
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tour.language || 'Any language'}
          </span>
          <span className="inline-flex items-center gap-2 text-slate-700">
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="flex items-center gap-0.5">
              {stars.map((filled, index) => (
                <svg key={index} className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-slate-300'}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
              ))}
            </span>
          </span>
        </div>

        <Link to={`/tours/${tour._id}`} className="hover:text-blue-600">
          <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">{tour.title}</h3>
        </Link>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-2">{tour.description}</p>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">{tour.guideId?.name?.charAt(0) || 'G'}</div>
          <div>
            <p className="font-medium text-slate-900">{tour.guideId?.name || 'Guide'}</p>
            <p className="text-slate-500">Local expert</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-sm font-semibold text-slate-700">Choose a tour date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {tour.availabilityDates?.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">Available dates: {tour.availabilityDates.slice(0, 3).map((d) => new Date(d).toLocaleDateString()).join(', ')}</p>
          )}
        </div>

        <div className="mt-auto pt-6">
          {user && user.role === 'Tourist' ? (
            <div className="space-y-3">
              <button onClick={handleBook} className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Book tour</button>
              {bookingMsg && (
                <p className={`text-center text-sm font-medium ${bookingMsg.toLowerCase().includes('failed') ? 'text-red-500' : 'text-emerald-600'}`}>{bookingMsg}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sign in as a Tourist to book this experience.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
