const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

const transporter = nodemailer.createTransport(emailConfig.smtp);

const emailService = {
    async sendVerificationEmail(email, verificationCode) {
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: 'Verify Your Email for Dog Cafe Reservation',
            html: `
                <h2>Welcome to Dog Cafe!</h2>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    },

    async sendReservationConfirmation(email, reservation) {
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: 'Dog Cafe Reservation Confirmation',
            html: `
                <h2>Reservation Confirmation</h2>
                <p>Dear ${reservation.customerInfo.name},</p>
                <p>Your reservation has been confirmed for:</p>
                <ul>
                    <li>Date: ${new Date(reservation.date).toLocaleDateString()}</li>
                    <li>Time: ${reservation.timeSlot}</li>
                    <li>Services: ${reservation.selectedServices.join(', ')}</li>
                </ul>
                <p>Thank you for choosing Dog Cafe!</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    },
    async sendAdoptionApplicationConfirmation(email, application) {
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: 'Dog Cafe - Adoption Application Received',
            html: `
                <h2>Adoption Application Confirmation</h2>
                <p>Dear ${application.customerInfo.name},</p>
                <p>We have received your adoption application for:</p>
                <ul>
                    <li>Dog: ${application.dog.name}</li>
                    <li>Application ID: ${application._id}</li>
                    <li>Status: ${application.status}</li>
                </ul>
                <p>We will review your application and contact you soon.</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
};

module.exports = emailService;