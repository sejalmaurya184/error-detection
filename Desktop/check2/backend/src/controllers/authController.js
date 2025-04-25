const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer (you'll need to add your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save token
    await pool.query(
      'INSERT INTO tokens (userId, token, type, expiresAt) VALUES (?, ?, ?, ?)',
      [users[0].id, resetToken, 'password_reset', expiresAt]
    );

    // Send email
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.`
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email', error: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find valid token
    const [tokens] = await pool.query(
      'SELECT * FROM tokens WHERE token = ? AND type = ? AND expiresAt > NOW()',
      [token, 'password_reset']
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query('UPDATE users SET password = ? WHERE id = ?', 
      [hashedPassword, tokens[0].userId]
    );

    // Delete used token
    await pool.query('DELETE FROM tokens WHERE id = ?', [tokens[0].id]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

// @desc    Send verification email
// @route   POST /api/auth/send-verification
// @access  Private
const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 3600000); // 24 hours

    // Save token
    await pool.query(
      'INSERT INTO tokens (userId, token, type, expiresAt) VALUES (?, ?, ?, ?)',
      [userId, verificationToken, 'email_verification', expiresAt]
    );

    // Send email
    const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      to: users[0].email,
      subject: 'Verify Your Email',
      html: `Click <a href="${verifyUrl}">here</a> to verify your email address.`
    });

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification email', error: error.message });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
// @desc    Verify email
// @route   GET /api/auth/verify-email?token=:token
// @access  Public
const { User } = require('../models/userModel');

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find and verify token
    const [security] = await pool.query(
      'SELECT userId FROM user_security WHERE verificationToken = ?',
      [token]
    );

    if (security.length === 0) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Update verification status
    await pool.query(
      'UPDATE users SET isEmailVerified = TRUE, verificationToken = NULL WHERE userId = ?',
      [security[0].userId]
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      message: 'Error verifying email',
      error: error.message
    });
  }
};


// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.query;
//     console.log(req.query);

//     const user = await User.findOne({ where: { verificationToken: token } });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token', verified: false });
//     }

//     user.isEmailVerified = true;
//     user.verificationToken = null;
//     await user.save();

//     return res.status(200).json({ message: 'Email verified successfully', verified: true });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error', verified: false });
//   }
// };


// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.query;

//     // Find valid token
//     const [tokens] = await pool.query(
//       'SELECT * FROM tokens WHERE token = ? AND type = ? AND expiresAt > NOW()',
//       [token, 'email_verification']
//     );

//     if (tokens.length === 0) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Update user
//     await pool.query('UPDATE users SET isEmailVerified = TRUE WHERE id = ?', 
//       [tokens[0].userId]
//     );

//     // Delete used token
//     await pool.query('DELETE FROM tokens WHERE id = ?', [tokens[0].id]);

//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error verifying email', error: error.message });
//   }
// };

module.exports = {
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
}; 