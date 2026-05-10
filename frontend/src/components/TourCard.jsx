
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

  const handleBook = async () => {
    setBookingMsg('');
    try {
      await api.post('/bookings', { tourId: tour._id });
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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100 group-hover:scale-105 transition-transform duration-500"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
          ${tour.price}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tour.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {tour.language}
          </span>
        </div>

        <Link to={`/tours/${tour._id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{tour.title}</h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-2 mb-5">{tour.description}</p>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
            {tour.guideId?.name?.charAt(0) || 'G'}
          </div>
          <div className="text-sm text-gray-600">
            Guide: <span className="font-medium text-gray-900">{tour.guideId?.name || 'Unknown'}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          {user && user.role === 'Tourist' ? (
            <div className="space-y-3">
              <button
                onClick={handleBook}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl transition-colors duration-200 focus:ring-4 focus:ring-blue-600/30 active:scale-[0.98]"
              >
                Book Tour
              </button>
              {bookingMsg && (
                <div
                  className={`text-sm text-center font-medium ${bookingMsg.toLowerCase().includes('failed') ? 'text-red-500' : 'text-green-600'}`}
                  role="alert"
                >
                  {bookingMsg}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Sign in as a Tourist to book this experience.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
