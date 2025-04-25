const { pool } = require('../config/db');

const CREATE_PASSWORD_RESET_TABLE = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

const CREATE_USER_SECURITY_TABLE = `
  CREATE TABLE IF NOT EXISTS user_security (
    userId INT PRIMARY KEY,
    isEmailVerified BOOLEAN DEFAULT TRUE,
    verificationToken VARCHAR(255),
    failedLoginAttempts INT DEFAULT 0,
    lockoutUntil TIMESTAMP NULL,
    lastLoginAt TIMESTAMP NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

const initializeSecurityTables = async () => {
  try {
    await pool.query(CREATE_PASSWORD_RESET_TABLE);
    await pool.query(CREATE_USER_SECURITY_TABLE);
    console.log('Security tables initialized');
  } catch (error) {
    console.error('Error initializing security tables:', error);
    throw error;
  }
};

module.exports = { initializeSecurityTables }; 