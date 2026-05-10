const request = require('supertest');
const { connect } = require('../setup/db');
const app = require('../../backend/app');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');

const generateQueryCases = () => {
  const locations = ['Dhaka', 'Sylhet', 'Chittagong', 'Bogura', ''];
  const categories = ['Adventure', 'Heritage', 'Nature', ''];
  const languages = ['English', 'Bangla', 'Spanish', ''];
  const priceRanges = [null, { min: 1000, max: 2000 }, { min: 3000, max: 5000 }, { min: 0, max: 10000 }];
  const dateValues = ['', new Date(Date.now() + 86400000).toISOString(), new Date(Date.now() + 2 * 86400000).toISOString(), '2024-02-30', 'invalid'];
  const pageValues = [1, 2, 3, 10];
  const limitValues = [1, 2, 3, 6];
  const cases = [];
  for (const location of locations) {
    for (const category of categories) {
      for (const language of languages) {
        for (const pr of priceRanges) {
          for (const date of dateValues) {
            for (const page of pageValues) {
              for (const limit of limitValues) {
                cases.push({ location, category, language, priceRange: pr, date, page, limit });
                if (cases.length >= 520) return cases;
              }
            }
          }
        }
      }
    }
  }
  return cases;
};

beforeAll(async () => {
  await connect();
});

describe('Tour Query Bulk Tests', () => {
  const queryCases = generateQueryCases();

  queryCases.forEach((params, index) => {
    test(`query combination ${index + 1}`, async () => {
      const guide = await User.create({ name: `QueryGuide${index}`, email: `queryguide${index}@test.com`, password: 'password', role: 'Guide' });
      const baseDate1 = new Date(Date.now() + 86400000);
      const baseDate2 = new Date(Date.now() + 2 * 86400000);
      await Tour.create([
        { guideId: guide._id, title: 'Tour A', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 1500, availabilityDates: [baseDate1] },
        { guideId: guide._id, title: 'Tour B', description: 'desc', location: 'Sylhet', category: 'Heritage', language: 'Bangla', price: 3000, availabilityDates: [baseDate1] },
        { guideId: guide._id, title: 'Tour C', description: 'desc', location: 'Chittagong', category: 'Nature', language: 'English', price: 1000, availabilityDates: [baseDate2] },
        { guideId: guide._id, title: 'Tour D', description: 'desc', location: 'Dhaka', category: 'Heritage', language: 'Bangla', price: 5000, availabilityDates: [baseDate1, baseDate2] },
        { guideId: guide._id, title: 'Tour E', description: 'desc', location: 'Bogura', category: 'Adventure', language: 'Spanish', price: 800, availabilityDates: [baseDate2] },
      ]);

      const query = [];
      if (params.location) query.push(`location=${params.location}`);
      if (params.category) query.push(`category=${params.category}`);
      if (params.language) query.push(`language=${params.language}`);
      if (params.priceRange) {
        query.push(`minPrice=${params.priceRange.min}`, `maxPrice=${params.priceRange.max}`);
      }
      if (params.date) query.push(`date=${encodeURIComponent(params.date)}`);
      query.push(`page=${params.page}`, `limit=${params.limit}`);

      const res = await request(app).get(`/api/tours?${query.join('&')}`);
      if (params.date && isNaN(new Date(params.date).getTime())) {
        expect(res.status).toBe(400);
      } else {
        expect(res.status).toBe(200);
      }
    });
  });
});
