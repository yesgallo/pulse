
const request = require('supertest');
const app = require('../src/app');
const { createClient } = require('redis');


const testClient = createClient({
  url: 'redis://localhost:6379',
});

describe('GET /ping', () => {
  beforeAll(async () => {
    await testClient.connect();
  });

  afterAll(async () => {
    await testClient.flushAll(); 
    await testClient.quit();
  });

  it('debe responder con status 200 y guardar en Redis', async () => {
    const response = await request(app)
      .get('/ping')
      .set('User-Agent', 'test-agent')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'pong');
    expect(response.body).toHaveProperty('saved', true);

    
    const keys = await testClient.keys('ping:*');
    expect(keys.length).toBeGreaterThan(0);
  });

  it('debe responder en menos de 100ms', async () => {
    const start = Date.now();
    await request(app).get('/ping');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});

describe('GET /responses', () => {
  beforeAll(async () => {
    if (!testClient.isOpen) await testClient.connect();
  });

  afterAll(async () => {
    await testClient.flushAll();
    await testClient.quit();
  });

  it('debe devolver todos los pings guardados', async () => {
    await request(app).get('/ping');
    const response = await request(app).get('/responses').expect(200);
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('responses');
    expect(Array.isArray(response.body.responses)).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);
  });
});