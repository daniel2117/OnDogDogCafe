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

    async sendReservationConfirmation(email, data) {
        console.log(`[Email Service] Sending reservation confirmation to: ${email}`);
        
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: `Dog Cafe Reservation ${data.isModification ? 'Update' : 'Confirmation'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Reservation ${data.isModification ? 'Update' : 'Confirmation'}</h2>
                    <p>Dear ${data.customerInfo?.name || 'Valued Customer'},</p>
                    <p>Your reservation has been ${data.isModification ? 'updated' : 'confirmed'} for:</p>
                    <ul>
                        <li>Date: ${new Date(data.date).toLocaleDateString()}</li>
                        <li>Time: ${data.timeSlot}</li>
                        <li>Number of People: ${data.numberOfPeople}</li>
                        <li>Services: ${data.selectedServices.join(', ')}</li>
                    </ul>
                    <p>Thank you for choosing Dog Cafe!</p>
                </div>
            `
        };

        try {
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Reservation confirmation sent successfully');
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send reservation confirmation:', error);
            return false;
        }
    },

    async sendAdoptionApplicationConfirmation(email, data) {
        console.log(`[Email Service] Sending adoption confirmation to: ${email}`);
        
        const getStatusText = (status) => {
            switch(status) {
                case 'updated': return 'has been updated';
                case 'withdrawn': return 'has been withdrawn';
                case 'approved': return 'has been approved';
                case 'rejected': return 'has been rejected';
                default: return 'has been received';
            }
        };

        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: 'Adoption Application Update',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Adoption Application Update</h2>
                    <p>Dear ${data.name || 'Applicant'},</p>
                    <p>Your adoption application ${getStatusText(data.status)}.</p>
                    <p>Application ID: ${data.applicationId || 'N/A'}</p>
                    ${data.dogName ? `<p>Dog Name: ${data.dogName}</p>` : ''}
                    <p>We will contact you soon with further information.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `
        };

        try {
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Adoption confirmation sent successfully');
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send adoption confirmation:', error);
            return false;
        }
    },

    async sendRehomingApplicationConfirmation(email, data) {
        console.log(`[Email Service] Sending rehoming confirmation to: ${email}`);
        
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: 'Rehoming Application Update',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Rehoming Application Update</h2>
                    <p>Dear ${data.name || 'Applicant'},</p>
                    <p>Your rehoming application for ${data.petName || 'your pet'} has been ${data.status || 'received'}.</p>
                    <p>Application ID: ${data.applicationId || 'N/A'}</p>
                    <p>We will review your application and contact you soon.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `
        };

        try {
            const info = await this.retryEmailSend(mailOptions);
            console.log('[Email Service] Rehoming confirmation sent successfully');
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send rehoming confirmation:', error);
            return false;
        }
    },

    // Keep the retry mechanism
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
    }
};

module.exports = emailService;