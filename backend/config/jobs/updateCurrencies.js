const axios = require('axios');
const db = require('../db');

async function atualizarBancoDeDados() {
  try {
    const response = await axios.get(
      `https://brapi.dev/api/v2/currency/available?token=${process.env.DB_PASSWORD}`
    );

    const data = response.data;
    if (!data || !data.currencies) throw new Error('Resposta inválida da API');

    const values = data.currencies.map((item) => [item.name, item.currency]);

    const query = `
      INSERT INTO currencies (name, currency)
      VALUES ?
      ON DUPLICATE KEY UPDATE currency = VALUES(currency)
    `;

    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar moedas:', err);
      } else {
        console.log('Atualização do banco de dados concluída:', result.affectedRows, 'linhas');
      }
    });
  } catch (err) {
    console.error('Erro na função de atualização:', err.message);
  }
}

module.exports = atualizarBancoDeDados;
