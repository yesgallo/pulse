const express = require('express');
const rateLimit = require('express-rate-limit');
const { client } = require('./redis');
const validateToken = require('./middleware/validateToken');

const app = express();
app.use(express.json());

// Rate limiter para endpoints sensibles (solo después de autenticación)
const redisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP en 15 minutos
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ /health → sin autenticación ni rate limiting
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ✅ /ping → sin autenticación ni rate limiting
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

// 🔒 GET /responses → autenticación + rate limiting
app.get('/responses', validateToken, redisLimiter, async (req, res) => {
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

// 🔒 DELETE /responses → autenticación + rate limiting
app.delete('/responses', validateToken, redisLimiter, async (req, res) => {
  try {
    const keys = await client.keys('ping:*');
    if (keys.length > 0) {
      await client.del(...keys);
    }
    res.status(200).json({ message: 'All responses have been cleared successfully' });
  } catch (error) {
    console.error('Error al limpiar Redis:', error);
    res.status(500).json({ message: 'Failed to clear responses' });
  }
});

module.exports = app;