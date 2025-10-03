
const express = require('express');
const { client } = require('./redis');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ping', async (req, res) => {
  const pingData = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'unknown',
    path: req.originalUrl,
  };

  try {
    const key = `ping:${pingData.timestamp}`;
    await client.set(key, JSON.stringify(pingData), { EX: 3600 });
    res.status(200).json({ status: 'pong', timestamp: pingData.timestamp, saved: true });
  } catch (error) {
    console.error('Error al guardar en Redis:', error);
    res.status(500).json({ status: 'error', message: 'No se pudo guardar en Redis' });
  }
});

app.get('/responses', async (req, res) => {
  try {
    const keys = await client.keys('ping:*');
    const pings = [];
    for (const key of keys) {
      const data = await client.get(key);
      if (data) pings.push(JSON.parse(data));
    }
  
    pings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.status(200).json({ count: pings.length, responses: pings });
  } catch (error) {
    console.error('Error al leer de Redis:', error);
    res.status(500).json({ status: 'error', message: 'No se pudo leer de Redis' });
  }
});

module.exports = app;