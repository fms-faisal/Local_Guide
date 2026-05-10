import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import Chat from '../components/Chat';
import BookingCalendar from '../components/BookingCalendar';

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
  if (!tour) return <div className="min-h-screen flex items-center justify-center py-16"><div className="text-center text-gray-500">Tour not found.</div></div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] overflow-hidden bg-white shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 sm:p-14">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-200 mb-3">Tour details</p>
                <h1 className="text-4xl font-extrabold mb-4">{tour.title}</h1>
                <p className="text-blue-100 max-w-2xl">{tour.description}</p>
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.95fr] p-8 sm:p-10">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">{tour.location}</p>
                  </div>
                  <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">{tour.language}</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Guide</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{tour.guideId?.name || 'Unknown'}</p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">${tour.price}</p>
                </div>
                <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Book a Date</h2>
                  <BookingCalendar availableDates={(tour.availabilityDates || []).map(d => d.split('T')[0])} onDateSelect={() => {}} />
                </section>
                {user && user.role === 'Tourist' && tour.guideId?._id && (
                  <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat with Guide</h2>
                    <Chat otherUserId={tour.guideId._id} tourId={id} />
                  </section>
                )}
                <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                      <p className="text-gray-500 text-sm mt-1">Read traveler feedback and add your own.</p>
                    </div>
                  </div>
                  {user && user.role === 'Tourist' && (
                    <form onSubmit={handleReview} className="space-y-4 mb-6" aria-label="Submit review">
                      <label className="block text-sm font-medium text-gray-700">Leave a review</label>
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                        <select
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                          aria-label="Rating"
                        >
                          {[5,4,3,2,1].map(r => (
                            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <textarea
                          value={review}
                          onChange={e => setReview(e.target.value)}
                          placeholder="Share your experience..."
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                          rows={3}
                          aria-label="Review"
                        />
                      </div>
                      <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-600/30">
                        Submit Review
                      </button>
                      {reviewMsg && <div className="text-green-600 text-sm" role="alert">{reviewMsg}</div>}
                    </form>
                  )}
                  {reviews.length === 0 ? (
                    <div className="text-gray-500">No reviews yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {reviews.map(r => (
                        <li key={r._id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{r.touristId?.name || 'Anonymous'}</span>
                            <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          </div>
                          <p className="text-gray-700">{r.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TourDetails;
