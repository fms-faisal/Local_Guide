
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
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
      <Link to={`/tours/${tour._id}`} className="font-bold text-lg hover:underline">{tour.title}</Link>
      <div>{tour.description}</div>
      <div className="text-sm text-gray-600">Location: {tour.location}</div>
      <div className="text-sm text-gray-600">Language: {tour.language}</div>
      <div className="text-sm text-gray-600">Price: ${tour.price}</div>
      <div className="text-sm text-gray-600">Guide: {tour.guideId?.name}</div>
      {user && user.role === 'Tourist' && (
        <>
          <button onClick={handleBook} className="bg-blue-600 text-white px-3 py-1 rounded mt-2 focus:ring-2 focus:ring-blue-400">Book Tour</button>
          {bookingMsg && <div className="text-green-600 text-sm mt-1" role="alert">{bookingMsg}</div>}
        </>
      )}
    </div>
  );
};

export default TourCard;
