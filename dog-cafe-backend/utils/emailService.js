const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const cache = require('./cache');

const transporter = nodemailer.createTransport(emailConfig.smtp);

const emailService = {
    async sendVerificationEmail(email, verificationCode) {
        console.log(`[Email Service] Attempting to send verification email to: ${email}`);
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
            console.log('[Email Service] Sending verification email with options:', {
                to: email,
                subject: mailOptions.subject
            });
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Verification email sent successfully:', {
                messageId: info.messageId,
                response: info.response
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send verification email:', error);
            return false;
        }
    },

    async sendReservationConfirmation(email, reservation) {
        console.log(`[Email Service] Attempting to send reservation confirmation to: ${email}`);
        const isModification = reservation.isModification || false;
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: `Dog Cafe Reservation ${isModification ? 'Update' : 'Confirmation'}`,
            html: `
                <h2>Reservation ${isModification ? 'Update' : 'Confirmation'}</h2>
                <p>Dear ${reservation.customerInfo.name},</p>
                <p>Your reservation has been ${isModification ? 'updated' : 'confirmed'} for:</p>
                <ul>
                    <li>Date: ${new Date(reservation.date).toLocaleDateString()}</li>
                    <li>Time: ${reservation.timeSlot}</li>
                    <li>Number of People: ${reservation.numberOfPeople}</li>
                    <li>Services: ${reservation.selectedServices.join(', ')}</li>
                </ul>
                <p>Thank you for choosing Dog Cafe!</p>
            `
        };

        try {
            console.log('[Email Service] Sending reservation confirmation with options:', {
                to: email,
                subject: mailOptions.subject,
                reservationDate: new Date(reservation.date).toLocaleDateString(),
                timeSlot: reservation.timeSlot
            });
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Reservation confirmation sent successfully:', {
                messageId: info.messageId,
                response: info.response
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send reservation confirmation:', error);
            return false;
        }
    },

    async sendAdoptionApplicationConfirmation(email, application) {
        console.log(`[Email Service] Attempting to send adoption application confirmation to: ${email}`);
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
            console.log('[Email Service] Sending adoption confirmation with options:', {
                to: email,
                subject: mailOptions.subject,
                applicationId: application._id,
                dogName: application.dog.name
            });
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Adoption confirmation sent successfully:', {
                messageId: info.messageId,
                response: info.response
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send adoption confirmation:', error);
            return false;
        }
    },

    // Add email verification caching
    async isVerificationCodeValid(email, code) {
        const storedCode = await cache.get(`verification:${email}`);
        return storedCode === code;
    },

    // Add rate limiting for email sending
    async canSendEmail(email) {
        const key = `email_limit:${email}`;
        const count = await cache.get(key) || 0;
        
        if (count >= 5) { // Max 5 emails per hour
            return false;
        }
        
        await cache.set(key, count + 1, 3600); // 1 hour expiry
        return true;
    },

    // Improve error handling in retryEmailSend
    async retryEmailSend(mailOptions, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`[Email Service] Email sent successfully on attempt ${i + 1}`);
                return info;
            } catch (error) {
                console.error(`[Email Service] Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    },

    // Add HTML template support
    getEmailTemplate(type, data) {
        const templates = {
            verification: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Welcome to Dog Cafe!</h2>
                    <p>Your verification code is: <strong>${data.code}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
            // Add more templates as needed
        };
        return templates[type];
    }
};

module.exports = emailService;