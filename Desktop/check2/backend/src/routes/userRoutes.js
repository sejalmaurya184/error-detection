const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateEmail } = require('../middleware/emailValidator');
const {
  registerUser,
  loginUser,
  getUsers,
  getUserByEmail,
  updateProfile,
  changePassword,
  getLoginHistory,
  verifyEmail
} = require('../controllers/userController');
const nodemailer = require('nodemailer');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Public routes
router.post('/signup', async (req, res, next) => {
  const { email } = req.body;
  
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Invalid email address. Please use a valid email.'
    });
  }
  
  next();
}, registerUser);
router.post('/login', loginUser);

//////////////////
// Optional debug middleware (can be removed in production)
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});
/////////////
// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/login-history', protect, getLoginHistory);
router.get('/search', protect, getUserByEmail);
router.get('/', protect, getUsers);

// Add this route temporarily for testing email configuration
router.get('/test-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    await transporter.verify();
    res.json({ message: 'Email configuration is correct' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Email configuration error', 
      error: error.message 
    });
  }
});

module.exports = router; 