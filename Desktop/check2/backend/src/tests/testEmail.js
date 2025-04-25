require('dotenv').config();
const { sendEmail } = require('../config/email');

const testEmail = async () => {
    console.log('Starting email test...');
    console.log('Email configuration:', {
        emailUser: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD,
        frontendUrl: process.env.FRONTEND_URL
    });

    try {
        await sendEmail(
            'sejalmaurya1aug@gmail.com', // your email address
            'HealthVault Test Email',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #007bff;">Test Email</h2>
                <p>This is a test email from HealthVault.</p>
                <p>If you receive this, your email configuration is working correctly!</p>
                <p>Time sent: ${new Date().toLocaleString()}</p>
            </div>
            `
        );
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Failed to send test email:', {
            message: error.message,
            code: error.code,
            response: error.response
        });
    }
};

// Run the test
testEmail(); 