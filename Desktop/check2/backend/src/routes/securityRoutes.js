const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getAccountStatus
} = require('../controllers/securityController');

// Public routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
//router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.post('/send-verification', protect, sendVerificationEmail);
router.get('/account-status', protect, getAccountStatus);

module.exports = router; 