const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'forex_app'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conecta:', err);
    return;
  }
  console.log('Conectado!');
});

module.exports = db;
