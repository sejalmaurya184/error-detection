const { pool } = require('../config/db');

const CREATE_RECORDS_TABLE = `
  CREATE TABLE IF NOT EXISTS records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    diagnosis TEXT,
    prescription TEXT,
    recordDate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

const initializeRecordTable = async () => {
  try {
    await pool.query(CREATE_RECORDS_TABLE);
    console.log('Records table initialized');
  } catch (error) {
    console.error('Error initializing records table:', error);
    throw error;
  }
};

module.exports = { initializeRecordTable }; 