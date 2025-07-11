const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer token"

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  console.log("Token recebido:", token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.user = user; // anexa os dados do usuário à requisição
    next();
  });
}

module.exports = authenticateToken;
