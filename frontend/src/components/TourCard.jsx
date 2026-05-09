const TourCard = ({ tour }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
    <h2 className="font-bold text-lg mb-1">{tour.title}</h2>
    <div className="text-gray-600 mb-2">{tour.location} &bull; {tour.language}</div>
    <div className="mb-2">{tour.description}</div>
    <div className="font-semibold">${tour.price}</div>
    <div className="text-xs text-gray-400 mt-1">Category: {tour.category}</div>
  </div>
);

export default TourCard;
