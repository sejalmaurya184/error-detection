const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../controllers/authController');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
} = require('../controllers/authController');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-verification', protect, sendVerificationEmail);

//router.get('/verify-email/:token', verifyEmail);
router.get('/verify-email/:token', verifyEmail);
module.exports = router; 