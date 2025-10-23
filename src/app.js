
const express = require('express');
const { client } = require('./redis');
const validateToken = require('./middleware/validateToken');

const app = express();
app.use(express.json());

// ✅ /health → sin autenticación
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ✅ /ping → sin autenticación
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

// /responses → requiere token
app.get('/responses', validateToken, async (req, res) => {
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

// DELETE /responses → elimina todos los pings
app.delete('/responses', validateToken, async (req, res) => {
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