const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Updated SQL table creation query with proper timestamp default
const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isEmailVerified TINYINT(1) DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Initialize the table
const initializeUserTable = async () => {
  try {
    await pool.query(CREATE_USERS_TABLE);
    console.log('Users table initialized');
  } catch (error) {
    console.error('Error initializing users table:', error);
    throw error;
  }
};

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { name, email, password } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, isEmailVerified) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword,1]
      );

      const [newUser] = await pool.query(
        'SELECT id, name, email, createdAt FROM users WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { User, initializeUserTable }; 