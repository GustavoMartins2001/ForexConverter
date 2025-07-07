const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const axios = require('axios');
const atualizarBancoDeDados = require('../config/jobs/updateCurrencies');
const authenticateToken = require('../config/middleware/auth');



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



router.get('/currencies', (req, res) => {
    const query = 'SELECT * FROM currencies';

    db.query(query, async (err, results) => {
        if (err) 
            return res.status(500).json({ error: 'Erro no servidor' });
        if (results.length === 0) 
            return res.status(401).json({ error: 'Não há registros' });
        
        res.json(results)
    })
});

router.get('/currencies/:pair', authenticateToken, async (req, res) => {
    const { pair } = req.params;
    try{
      valor = await axios.get(`https://brapi.dev/api/v2/currency?currency=${pair}&token=${process.env.API_KEY}`)
      //envia somente os dados essenciais do par de moedas selecionado
      res.json({
        fromCurrency: valor.data.currency[0].fromCurrency,
        toCurrency: valor.data.currency[0].toCurrency,
        askPrice: valor.data.currency[0].askPrice,
      });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar dados da moeda' });
    }
  });

// forca a atualizacao do banco de dados mesmo fora do horario
router.post('/currencies/update', authenticateToken, async (req, res) => {
  try {
    await atualizarBancoDeDados();
    res.json({ message: 'Atualização manual concluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

router.post('/currencies', authenticateToken, async (req, res) => {
  try {
    const currencies = req.body;

    if (currencies.length === 0) {
      return res.status(400).json({ error: 'Envie um par de moedas válido.' });
    }

    const { name, currency } = currencies;

    //caso a currency já exista, atualiza o nome e a moeda
    const query = `
      INSERT INTO currencies (name, currency)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), currency = VALUES(currency);
    `;

    await db.promise().query(query, [name, currency]);

    res.status(200).json({ message: 'Moedas inseridas/atualizadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar moedas:', error);
    res.status(500).json({ error: 'Erro interno ao adicionar moedas.' });
  }
});

module.exports = router;