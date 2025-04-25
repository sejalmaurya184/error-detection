const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'healthvault',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

const connectDB = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('MySQL Database Connected');
  } catch (error) {
    console.error('Database Connection Error:', error);
    throw error;
  }
};

module.exports = { connectDB, pool: promisePool }; 