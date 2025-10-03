
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';


const client = createClient({
  url: redisUrl,
});


client.on('error', (err) => {
  console.error('[Redis] Error:', err);
});


(async () => {
  try {
    await client.connect();
    console.log('[Redis] Conectado exitosamente');
  } catch (err) {
    console.error('[Redis] No se pudo conectar:', err);
  }
})();

module.exports = { client };