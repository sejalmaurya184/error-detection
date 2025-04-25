const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./src/config/db');
const { initializeUserTable } = require('./src/models/userModel');
const { initializeRecordTable } = require('./src/models/recordModel');
const { initializeLoginHistoryTable } = require('./src/models/loginHistoryModel');
const userRoutes = require('./src/routes/userRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const securityRoutes = require('./src/routes/securityRoutes');
const { initializeSecurityTables } = require('./src/models/userSecurityModel');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route at root level
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/security', securityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connected successfully');

    // Initialize tables in correct order
    await initializeUserTable();
    await initializeRecordTable();
    await initializeLoginHistoryTable();
    await initializeSecurityTables();
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); 