const { getTransporter } = require('../config/email');

const testEmail = async () => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "test@example.com", // replace with your test email
      subject: "Test Email",
      text: "If you receive this, email sending is working!"
    });
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Email error:', error);
  }
};

testEmail(); 