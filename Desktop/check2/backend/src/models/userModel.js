// const { pool } = require('../config/db');
// const bcrypt = require('bcryptjs');

// // Updated SQL table creation query with proper timestamp default
// const CREATE_USERS_TABLE = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     isEmailVerified TINYINT(1) DEFAULT 1,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   )
// `;

// // Initialize the table
// const initializeUserTable = async () => {
//   try {
//     await pool.query(CREATE_USERS_TABLE);
//     console.log('Users table initialized');
//   } catch (error) {
//     console.error('Error initializing users table:', error);
//     throw error;
//   }
// };

// class User {
//   static async findByEmail(email) {
//     try {
//       const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//       return rows[0];
//     } catch (error) {
//       throw error;
//     }
//   }

//   static async create(userData) {
//     try {
//       const { name, email, password } = userData;
//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       const [result] = await pool.query(
//         'INSERT INTO users (name, email, password, isEmailVerified) VALUES (?, ?, ?, ?)',
//         [name, email, hashedPassword,1]
//       );

//       const [newUser] = await pool.query(
//         'SELECT id, name, email, createdAt FROM users WHERE id = ?',
//         [result.insertId]
//       );

//       return newUser[0];
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// module.exports = { User, initializeUserTable }; 


const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Updated SQL table creation query with additional fields
const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    height VARCHAR(50),
    weight VARCHAR(50),
    phone VARCHAR(15),
    motherName VARCHAR(255),
    fatherName VARCHAR(255),
    specialization VARCHAR(255),
    licenseNumber VARCHAR(255),
    clinicName VARCHAR(255),
    experience VARCHAR(255),
    location VARCHAR(255),
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
  // Find a user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      const {
        name,
        email,
        password,
        age,
        gender,
        height,
        weight,
        phone,
        motherName,
        fatherName,
        specialization,
        licenseNumber,
        clinicName,
        experience,
        location
      } = userData;

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      const [result] = await pool.query(
        `INSERT INTO users (
          name, email, password, age, gender, height, weight, phone, motherName, fatherName,
          specialization, licenseNumber, clinicName, experience, location, isEmailVerified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          hashedPassword,
          age,
          gender,
          height,
          weight,
          phone,
          motherName,
          fatherName,
          specialization,
          licenseNumber,
          clinicName,
          experience,
          location,
          1 // Default value for isEmailVerified
        ]
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

  // Update user profile
  static async update(userId, userData) {
    try {
      const {
        name,
        email,
        age,
        gender,
        height,
        weight,
        phone,
        motherName,
        fatherName,
        specialization,
        licenseNumber,
        clinicName,
        experience,
        location
      } = userData;

      await pool.query(
        `UPDATE users SET 
          name = ?, email = ?, age = ?, gender = ?, height = ?, weight = ?, phone = ?, 
          motherName = ?, fatherName = ?, specialization = ?, licenseNumber = ?, 
          clinicName = ?, experience = ?, location = ?, updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [
          name,
          email,
          age,
          gender,
          height,
          weight,
          phone,
          motherName,
          fatherName,
          specialization,
          licenseNumber,
          clinicName,
          experience,
          location,
          userId
        ]
      );

      const [updatedUser] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      return updatedUser[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { User, initializeUserTable };