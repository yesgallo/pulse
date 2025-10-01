const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('debe responder con status 200 y JSON válido', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'ok',
        timestamp: expect.any(String),
      })
    );

    expect(() => new Date(response.body.timestamp).toISOString()).not.toThrow();
  });

  it('debe responder en menos de 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});