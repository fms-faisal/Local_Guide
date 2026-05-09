import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

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
