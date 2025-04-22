const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport(config.smtp);

const sendEmail = async (to, subject, text) => {
    try {
        if (!to || !subject || !text) {
            throw new Error('Missing required email parameters');
        }

        await transporter.sendMail({
            from: config.from,
            to,
            subject,
            text
        });
        console.log(`Email sent successfully to: ${to}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = { sendEmail };