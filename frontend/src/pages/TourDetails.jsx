import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewMsg, setReviewMsg] = useState('');
  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post('/reviews', { tourId: id, rating, comment: review });
      setReviewMsg('Review submitted!');
      setReview('');
      setRating(5);
      // Refresh reviews
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Review failed');
    }
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await api.get(`/tours/${id}`);
        setTour(res.data);
      } catch (err) {
        setTour(null);
      }
      setLoading(false);
    };
    fetchTour();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) return <Spinner />;
  if (!tour) return <div>Tour not found.</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-2 sm:px-4">
        <h1 className="text-2xl font-bold mb-2">{tour.title}</h1>
        <div className="mb-4 text-gray-700">{tour.description}</div>
        <div className="mb-2">Location: {tour.location}</div>
        <div className="mb-2">Language: {tour.language}</div>
        <div className="mb-2">Price: ${tour.price}</div>
        <div className="mb-2">Guide: {tour.guideId?.name}</div>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          {user && user.role === 'Tourist' && (
            <form onSubmit={handleReview} className="flex flex-col gap-1 mb-4" aria-label="Submit review">
              <label className="text-sm">Leave a Review:</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border p-1 rounded w-20 focus:outline-blue-400" aria-label="Rating">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
              </select>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Your review..." className="border p-1 rounded focus:outline-blue-400" rows={2} aria-label="Review" />
              <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded focus:ring-2 focus:ring-green-400">Submit Review</button>
              {reviewMsg && <div className="text-green-600 text-sm mt-1" role="alert">{reviewMsg}</div>}
            </form>
          )}
          {reviews.length === 0 ? (
            <div className="text-gray-500">No reviews yet.</div>
          ) : (
            <ul className="space-y-2">
              {reviews.map(r => (
                <li key={r._id} className="border rounded p-2">
                  <div className="font-semibold">{r.touristId?.name || 'Anonymous'}</div>
                  <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div>{r.comment}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
};

export default TourDetails;
