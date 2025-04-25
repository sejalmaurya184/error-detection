const { User } = require('../models/userModel');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dns = require('dns');
const { promisify } = require('util');
const resolveMx = promisify(dns.resolveMx);
const { sendVerificationEmail } = require('../services/emailService');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Add this function to check if email domain exists
const isEmailDomainValid = async (email) => {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await resolveMx(domain);
    return mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Received registration request for:', email);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'Email already registered. Please use a different email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create user
      const [userResult] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const userId = userResult.insertId;

      // Create user security entry
      await connection.query(
        'INSERT INTO user_security (userId, isEmailVerified, verificationToken) VALUES (?, ?, ?)',
        [userId, true, verificationToken]
      );

      // Configure email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        },
        debug: true // Add this for debugging
      });

      // Verify transporter configuration
      await transporter.verify();
      console.log('Email transporter verified successfully');

      // Send verification email
      const verificationUrl = `http://localhost:3000/api/auth/verify-email/${verificationToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your HealthVault Account',
        html: `
          <h2>Welcome to HealthVault!</h2>
          <p>Please click the link below to verify your email:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>If you didn't create this account, please ignore this email.</p>
        `
      });

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        userId: userId
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      console.error('Error during registration:', error);
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, createdAt FROM users'
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// @desc    Get user by email
// @route   GET /api/users/search
// @access  Public
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const [user] = await pool.query(
      'SELECT id, name, email, createdAt FROM users WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Check if email already exists for another user
    if (email) {
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user profile
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    // Get updated user info
    const [updatedUser] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    const user = users[0];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({
      message: 'Error changing password',
      error: error.message
    });
  }
};

// @desc    Get login history
// @route   GET /api/users/login-history
// @access  Private
const getLoginHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [history] = await pool.query(
      'SELECT id, loginTime, ipAddress, deviceInfo, status FROM login_history WHERE userId = ? ORDER BY loginTime DESC LIMIT 10',
      [userId]
    );

    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({
      message: 'Error retrieving login history',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password'
      });
    }

    // Get user with verification status
    const [users] = await pool.query(
      `SELECT users.*, user_security.isEmailVerified 
       FROM users 
       LEFT JOIN user_security ON users.id = user_security.userId 
       WHERE users.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};

// @desc    Verify email
// @route   GET /api/users/verify/:token
// @access  Public
// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     // Find user with verification token
//     const [security] = await pool.query(
//       'SELECT userId FROM user_security WHERE verificationToken = ?',
//       [token]
//     );

//     if (security.length === 0) {
//       return res.status(400).json({
//         message: 'Invalid verification token'
//       });
//     }

//     // Update user verification status
//     await pool.query(
//       'UPDATE user_security SET isEmailVerified = true, verificationToken = NULL WHERE userId = ?',
//       [security[0].userId]
//     );

//     res.status(200).json({
//       message: 'Email verified successfully. You can now log in.'
//     });

//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({
//       message: 'Error verifying email',
//       error: error.message
//     });
//   }
// };
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token', verified: false });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully', verified: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', verified: false });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserByEmail,
  loginUser,
  updateProfile,
  changePassword,
  getLoginHistory,
  verifyEmail
}; 