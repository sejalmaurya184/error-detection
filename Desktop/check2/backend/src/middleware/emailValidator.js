const validateEmail = (email) => {
  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.com',
    'throwawaymail.com',
    // Add more disposable email domains as needed
  ];

  const domain = email.split('@')[1].toLowerCase();
  
  // Check if domain is in disposable list
  if (disposableDomains.includes(domain)) {
    return false;
  }

  // Check email length
  if (email.length > 254) {
    return false;
  }

  // Check for valid characters
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!validEmailRegex.test(email)) {
    return false;
  }

  return true;
};

module.exports = {
  validateEmail
}; 