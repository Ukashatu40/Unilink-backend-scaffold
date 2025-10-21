// tests/export.test.js
const request = require('supertest');
const app = require('../index'); // adjust if your index exports the app; otherwise spin up server differently
// For a quick test you can export 'app' from src/index.js: module.exports = app;

describe('Export endpoints (protected)', () => {
  let token = null;

  beforeAll(async () => {
    // create a test user or reuse existing credentials
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: '123456' });
    token = loginRes.body.token;
  });

  test('GET /export/search-history (csv) - 200', async () => {
    const res = await request(app)
      .get('/export/search-history?format=csv')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
  });

  test('GET /export/sentiment-history (csv) - 200', async () => {
    const res = await request(app)
      .get('/export/sentiment-history?format=csv')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
  });
});
