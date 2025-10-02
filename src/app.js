// src/app.js
const express = require('express');
const { client, connectRedis } = require('./redis');

const app = express();

// Middleware para parsear JSON (por si en el futuro se usa)
app.use(express.json());

// Endpoint /health (sin Redis)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint /ping (con Redis)
app.get('/ping', async (req, res) => {
  const pingData = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'unknown',
    path: req.originalUrl,
  };

  try {
    // Guardar en Redis con clave "ping:<timestamp>"
    const key = `ping:${pingData.timestamp}`;
    await client.set(key, JSON.stringify(pingData), {
      EX: 3600, // Expira en 1 hora
    });

    res.status(200).json({
      status: 'pong',
      timestamp: pingData.timestamp,
      saved: true,
    });
  } catch (error) {
    console.error('Error al guardar en Redis:', error);
    res.status(500).json({
      status: 'error',
      message: 'No se pudo guardar en Redis',
    });
  }
});

// Conectar Redis al iniciar
connectRedis().catch(console.error);

module.exports = app;
