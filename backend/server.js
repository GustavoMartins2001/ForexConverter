require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Routes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
