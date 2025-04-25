const { pool } = require('../config/db');

const CREATE_TOKENS_TABLE = `
  CREATE TABLE IF NOT EXISTS tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    type ENUM('password_reset', 'email_verification') NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

// const initializeTokenTable = async () => {
//   try {
//     await pool.query(CREATE_TOKENS_TABLE);
//     console.log('Tokens table initialized');
//   } catch (error) {
//     console.error('Error initializing tokens table:', error);
//     throw error;
//   }
// };
const { initializeTokenTable } = require('./src/models/tokenModel');

const initializeDatabase = async () => {
  try {
    await initializeTokenTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();
module.exports = { initializeTokenTable }; 