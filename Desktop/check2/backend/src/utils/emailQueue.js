const Queue = require('better-queue');
const { sendEmailWithRetry } = require('./emailRetry');

const emailQueue = new Queue(async (mailOptions, cb) => {
  try {
    const result = await sendEmailWithRetry(mailOptions);
    cb(null, result);
  } catch (error) {
    cb(error);
  }
}, {
  concurrent: 3, // process 3 emails at a time
  maxRetries: 3,
  retryDelay: 1000
});

emailQueue.on('error', function(error) {
  console.error('Email queue error:', error);
});

module.exports = emailQueue; 