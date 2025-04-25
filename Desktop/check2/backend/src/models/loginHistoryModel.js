const { pool } = require('../config/db');

const CREATE_LOGIN_HISTORY_TABLE = `
  CREATE TABLE IF NOT EXISTS login_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ipAddress VARCHAR(45),
    deviceInfo VARCHAR(255),
    status VARCHAR(20),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

const initializeLoginHistoryTable = async () => {
  try {
    await pool.query(CREATE_LOGIN_HISTORY_TABLE);
    console.log('Login history table initialized');
  } catch (error) {
    console.error('Error initializing login history table:', error);
    throw error;
  }
};

module.exports = { initializeLoginHistoryTable }; 