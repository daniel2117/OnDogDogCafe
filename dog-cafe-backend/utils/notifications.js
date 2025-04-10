const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    // For testing purposes, use ethereal email
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'test@ethereal.email',
        pass: 'testpassword'
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"Dog Cafe" <dogcafe@example.com>',
            to,
            subject,
            text
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw error to prevent reservation process from failing
    }
};

const sendSMS = async (to, message) => {
    try {
        // Placeholder for SMS service integration
        console.log(`SMS would be sent to ${to}: ${message}`);
    } catch (error) {
        console.error('SMS sending failed:', error);
        // Don't throw error to prevent reservation process from failing
    }
};

module.exports = { sendEmail, sendSMS };