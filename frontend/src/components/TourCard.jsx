const TourCard = ({ tour }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
    <h2 className="font-bold text-lg mb-1">{tour.title}</h2>
    <div className="text-gray-600 mb-2">{tour.location} &bull; {tour.language}</div>
    <div className="mb-2">{tour.description}</div>
    <div className="font-semibold">${tour.price}</div>
    <div className="text-xs text-gray-400 mt-1">Category: {tour.category}</div>
  </div>
);

import { useState } from 'react';
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
      <div className="font-bold text-lg">{tour.title}</div>
      <div>{tour.description}</div>
      <div className="text-sm text-gray-600">Location: {tour.location}</div>
      <div className="text-sm text-gray-600">Language: {tour.language}</div>
      <div className="text-sm text-gray-600">Price: ${tour.price}</div>
      <div className="text-sm text-gray-600">Guide: {tour.guideId?.name}</div>
      {user && user.role === 'Tourist' && (
        <>
          <button onClick={handleBook} className="bg-blue-600 text-white px-3 py-1 rounded mt-2 focus:ring-2 focus:ring-blue-400">Book Tour</button>
          {bookingMsg && <div className="text-green-600 text-sm mt-1" role="alert">{bookingMsg}</div>}
          <form onSubmit={handleReview} className="flex flex-col gap-1 mt-2" aria-label="Submit review">
            <label className="text-sm">Leave a Review:</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border p-1 rounded w-20 focus:outline-blue-400" aria-label="Rating">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
            </select>
            <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Your review..." className="border p-1 rounded focus:outline-blue-400" rows={2} aria-label="Review" />
            <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded focus:ring-2 focus:ring-green-400">Submit Review</button>
            {reviewMsg && <div className="text-green-600 text-sm mt-1" role="alert">{reviewMsg}</div>}
          </form>
        </>
      )}
    </div>
  );
};

export default TourCard;
