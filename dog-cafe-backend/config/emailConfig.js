require('dotenv').config();

module.exports = {
    smtp: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true, // Enable debug logging
        logger: true  // Log to console
    },
    from: process.env.EMAIL_FROM || '"Dog Cafe" <noreply@dogcafe.com>'
};