const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/middleware/auth');

router.get('/me', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso concedido!', userId: req.user.id });
});

module.exports = router;
