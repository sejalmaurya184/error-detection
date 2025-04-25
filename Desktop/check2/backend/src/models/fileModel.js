const { pool } = require('../config/db');

const CREATE_FILES_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recordId INT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    fileSize INT NOT NULL,
    uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recordId) REFERENCES records(id) ON DELETE CASCADE
  )
`;

const initializeFileTable = async () => {
  try {
    await pool.query(CREATE_FILES_TABLE);
    console.log('Files table initialized');
  } catch (error) {
    console.error('Error initializing files table:', error);
    throw error;
  }
};

module.exports = { initializeFileTable }; 