// // Add this near your other routes
// app.get('/test-email', async (req, res) => {
//     console.log('=== Email Configuration Test ===');
//     console.log('Environment variables:');
//     console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
//     console.log('EMAIL_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set');
//     console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    
//     try {
//         const { sendEmail } = require('./config/email');
        
//         // Try to send a test email to yourself
//         await sendEmail(
//             process.env.EMAIL_USER, // sending to yourself for testing
//             'Test Email from HealthVault',
//             '<h1>Test Email</h1><p>This is a test email from your HealthVault server.</p>'
//         );
        
//         console.log('Test email sent successfully');
//         res.json({ message: 'Test email sent successfully' });
//     } catch (error) {
//         console.error('Test email failed:', error);
//         res.status(500).json({ 
//             error: 'Email test failed', 
//             details: error.message 
//         });
//     }
// }); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./src/config/db');

// Initialize table models
const { initializeUserTable } = require('./src/models/userModel');
const { initializeRecordTable } = require('./src/models/recordModel');
const { initializeLoginHistoryTable } = require('./src/models/loginHistoryModel');
const { initializeSecurityTables } = require('./src/models/userSecurityModel');
const {initializeTokenTable } = require('./src/models/tokenModel');


// Routes
const userRoutes = require('./src/routes/userRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const securityRoutes = require('./src/routes/securityRoutes');
const authRoutes = require('./src/routes/authRoutes'); // ✅ NEW: Auth routes added

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/auth', authRoutes); // ✅ Mount auth routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();
    console.log('Database connected successfully');

    // Initialize tables
    await initializeUserTable();
    await initializeRecordTable();
    await initializeLoginHistoryTable();
    await initializeSecurityTables();
    await initializeTokenTable();
    console.log('Tables initialized successfully');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Global error catch
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
