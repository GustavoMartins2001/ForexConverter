require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const atualizarBancoDeDados = require('./config/jobs/updateCurrencies');
const authRoutes = require('./routes/auth');
const crud = require('./routes/controller');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', [authRoutes, crud]);

// Rodar todo dia à meia-noite atualizacao da base de dados
cron.schedule('0 0 * * *', () => {
  console.log('Executando atualização automática do banco de dados...');
  atualizarBancoDeDados();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
