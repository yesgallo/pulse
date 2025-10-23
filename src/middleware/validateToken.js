
const { client } = require('../redis');

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid or missing token' });
  }

  const token = authHeader.split(' ')[1];
  const tokenKey = `token:${token}`;

  try {
    const exists = await client.exists(tokenKey);
    if (exists) {
      next(); // Token válido
    } else {
      return res.status(401).json({ message: 'Invalid or missing token' });
    }
  } catch (error) {
    console.error('Error al validar token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = validateToken;