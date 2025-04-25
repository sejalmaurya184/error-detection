const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer (you'll need to add your email credentials in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// @desc    Request password reset
// @route   POST /api/security/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(200).json({ message: 'If email exists, reset instructions will be sent' });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token
    await pool.query(
      'INSERT INTO password_reset_tokens (userId, token, expiresAt) VALUES (?, ?, ?)',
      [user.id, hashedToken, new Date(Date.now() + 3600000)] // Token expires in 1 hour
    );

    // Send email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `Please click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.`
    });

    res.status(200).json({ message: 'If email exists, reset instructions will be sent' });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing password reset',
      error: error.message
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/security/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const [tokens] = await pool.query(
      'SELECT userId FROM password_reset_tokens WHERE token = ? AND expiresAt > NOW()',
      [hashedToken]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, tokens[0].userId]
    );

    // Delete used token
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE token = ?',
      [hashedToken]
    );

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({
      message: 'Error resetting password',
      error: error.message
    });
  }
};

// @desc    Send email verification
// @route   POST /api/security/send-verification
// @access  Private
const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save verification token
    await pool.query(
      'UPDATE user_security SET verificationToken = ? WHERE userId = ?',
      [verificationToken, userId]
    );

    // Get user email
    const [users] = await pool.query(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );

    // Send verification email
    const verifyUrl = `http://localhost:3000/api/auth/verify-email?${verificationToken}`;
    await transporter.sendMail({
      to: users[0].email,
      subject: 'Verify Your Email',
      html: `Please click <a href="${verifyUrl}">here</a> to verify your email.`
    });

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      message: 'Error sending verification email',
      error: error.message
    });
  }
};

// @desc    Verify email
// @route   GET /api/security/verify-email/:token
// @access  Public
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
      'UPDATE user_security SET isEmailVerified = TRUE, verificationToken = NULL WHERE userId = ?',
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

// @desc    Check account status
// @route   GET /api/security/account-status
// @access  Private
const getAccountStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const [security] = await pool.query(
      'SELECT isEmailVerified, failedLoginAttempts, lockoutUntil, lastLoginAt FROM user_security WHERE userId = ?',
      [userId]
    );

    res.status(200).json(security[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting account status',
      error: error.message
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getAccountStatus
}; 