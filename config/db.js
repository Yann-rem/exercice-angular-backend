const mysql = require('mysql2')
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

connection.connect((error) => {
  if (error) {
    console.error('Erreur de connexion à la base de données :', error)
    process.exit(1)
  } else {
    console.log('Connecté à la base de données MySQL')
  }
})

module.exports = connection
