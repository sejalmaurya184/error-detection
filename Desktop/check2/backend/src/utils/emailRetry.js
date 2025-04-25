const transporter = require('../config/email');

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sendEmailWithRetry = async (mailOptions, retryCount = 0) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error(`Email sending failed (attempt ${retryCount + 1}):`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return sendEmailWithRetry(mailOptions, retryCount + 1);
    }

    throw error;
  }
};

module.exports = { sendEmailWithRetry }; 