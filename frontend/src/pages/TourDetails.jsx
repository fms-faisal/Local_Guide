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
  if (!tour) return <div className="min-h-screen flex items-center justify-center py-16 bg-slate-50"><div className="text-center text-slate-500">Tour not found.</div></div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1.4fr_0.95fr] lg:gap-10">
          <article className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="relative">
              <div className="aspect-[16/9] bg-slate-200">
                {tour.image ? (
                  <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-600 to-indigo-700" />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Premium guided tour</p>
                <h1 className="mt-3 text-4xl font-extrabold text-white">{tour.title}</h1>
              </div>
            </div>
            <div className="space-y-8 p-8 sm:p-10">
              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Location</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{tour.location}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Language</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{tour.language}</p>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">About this tour</p>
                <p className="mt-4 text-slate-600 leading-relaxed">{tour.description}</p>
              </section>

              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Guide</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{tour.guideId?.name || 'Unknown'}</p>
                  <p className="mt-2 text-slate-600">{tour.guideId?.profileDetails?.bio || 'Local expert ready to show you the best spots.'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Highlights</p>
                  <ul className="mt-4 space-y-3 text-slate-600">
                    <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Small group experience</li>
                    <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Verified local guide</li>
                    <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Flexible booking options</li>
                  </ul>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Traveler Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">No reviews yet.</div>
                ) : (
                  <ul className="mt-6 space-y-4">
                    {reviews.map(r => (
                      <li key={r._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-semibold text-slate-900">{r.touristId?.name || 'Anonymous'}</p>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p className="mt-3 text-slate-600">{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {user && user.role === 'Tourist' && (
                  <form onSubmit={handleReview} className="mt-8 space-y-4" aria-label="Submit review">
                    <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Rating</span>
                        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" aria-label="Rating">
                          {[5,4,3,2,1].map(r => (
                            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Review</span>
                        <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} placeholder="Share your experience" className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" aria-label="Review" />
                      </label>
                    </div>
                    <button type="submit" className="rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Submit Review</button>
                    {reviewMsg && <p className="text-sm text-emerald-600">{reviewMsg}</p>}
                  </form>
                )}
              </section>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-[1.5rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Book now</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">${tour.price}</p>
              <p className="mt-2 text-sm text-slate-600">Per person, booked with a verified guide.</p>
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Select a date</h3>
              <div className="mt-4">
                <BookingCalendar availableDates={(tour.availabilityDates || []).map(d => d.split('T')[0])} onDateSelect={() => {}} />
              </div>
            </div>
            <button className="mt-6 w-full rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20">Book Now</button>
          </aside>
        </div>
      </main>
    </>
  );
};

export default TourDetails;
