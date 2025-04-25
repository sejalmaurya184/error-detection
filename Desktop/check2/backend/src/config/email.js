const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail email
    pass: process.env.EMAIL_APP_PASSWORD // your Gmail app password
  }
});

module.exports = transporter; 