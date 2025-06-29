const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

    // Gerar token JWT para autenticação
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  });
});

// Cadastro interno para popular banco de dados pelo postman
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';

  db.query(query, [email, hashed], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao registrar usuário' });
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  });
});

module.exports = router;
