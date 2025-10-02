
const request = require('supertest');
const app = require('../src/app');
const { client } = require('../src/redis');

describe('GET /ping', () => {
  beforeAll(async () => {
    // Asegura que Redis esté conectado
    if (!client.isOpen) {
      await client.connect();
    }
  });

  afterAll(async () => {
    await client.quit();
  });

  it('debe responder con status 200 y guardar en Redis', async () => {
    const response = await request(app)
      .get('/ping')
      .set('User-Agent', 'test-agent')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'pong');
    expect(response.body).toHaveProperty('saved', true);

    // Verificar que se guardó en Redis
    const keys = await client.keys('ping:*');
    expect(keys.length).toBeGreaterThan(0);
  });

  it('debe responder en menos de 100ms', async () => {
    const start = Date.now();
    await request(app).get('/ping');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});