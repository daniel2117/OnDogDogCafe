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
        let subject, template;
        
        if (reservation.status === 'cancelled') {
            subject = 'Dog Cafe Reservation Cancellation';
            template = this.getEmailTemplate('reservation-cancelled', reservation);
        } else {
            subject = `Dog Cafe Reservation ${reservation.isModification ? 'Update' : 'Confirmation'}`;
            template = this.getEmailTemplate('reservation-confirmation', reservation);
        }

        try {
            console.log('[Email Service] Sending reservation notification with options:', {
                to: email,
                subject: subject
            });
            const info = await this.retryEmailSend({
                from: emailConfig.from,
                to: email,
                subject: subject,
                html: template
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send reservation notification:', error);
            return false;
        }
    },

    async sendAdoptionApplicationConfirmation(email, data) {
        let subject, template;
        switch (data.status) {
            case 'withdrawn':
                subject = 'Adoption Application Withdrawn';
                template = this.getEmailTemplate('adoption-withdrawn', data);
                break;
            case 'updated':
                subject = 'Adoption Application Updated';
                template = this.getEmailTemplate('adoption-updated', data);
                break;
            case 'approved':
                subject = 'Adoption Application Approved';
                template = this.getEmailTemplate('adoption-approved', data);
                break;
            case 'rejected':
                subject = 'Adoption Application Status Update';
                template = this.getEmailTemplate('adoption-rejected', data);
                break;
            default:
                subject = 'Adoption Application Received';
                template = this.getEmailTemplate('adoption-created', data);
        }

        try {
            console.log('[Email Service] Sending adoption confirmation with options:', {
                to: email,
                subject: subject
            });
            const info = await this.retryEmailSend({
                from: emailConfig.from,
                to: email,
                subject: subject,
                html: template
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send adoption confirmation:', error);
            return false;
        }
    },

    async sendRehomingApplicationConfirmation(email, data) {
        let subject, template;
        switch (data.status) {
            case 'withdrawn':
                subject = 'Rehoming Application Withdrawn';
                template = this.getEmailTemplate('rehoming-withdrawn', data);
                break;
            case 'updated':
                subject = 'Rehoming Application Updated';
                template = this.getEmailTemplate('rehoming-updated', data);
                break;
            case 'approved':
                subject = 'Rehoming Application Approved';
                template = this.getEmailTemplate('rehoming-approved', data);
                break;
            case 'rejected':
                subject = 'Rehoming Application Status Update';
                template = this.getEmailTemplate('rehoming-rejected', data);
                break;
            default:
                subject = 'Rehoming Application Received';
                template = this.getEmailTemplate('rehoming-created', data);
        }

        try {
            console.log('[Email Service] Sending rehoming confirmation with options:', {
                to: email,
                subject: subject
            });
            const info = await this.retryEmailSend({
                from: emailConfig.from,
                to: email,
                subject: subject,
                html: template
            });
            return true;
        } catch (error) {
            console.error('[Email Service] Failed to send rehoming confirmation:', error);
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
            // Adoption templates
            'adoption-created': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Thank You for Your Adoption Application</h2>
                    <p>Dear ${data.customerInfo.name},</p>
                    <p>We have received your adoption application${data.dog.name ? ` for ${data.dog.name}` : ''}.</p>
                    <p>Your application ID is: ${data._id}</p>
                    <p>We will review your application and contact you soon.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            'adoption-updated': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Adoption Application Updated</h2>
                    <p>Dear ${data.customerInfo.name},</p>
                    <p>Your adoption application${data.dog.name ? ` for ${data.dog.name}` : ''} has been updated.</p>
                    <p>Application ID: ${data._id}</p>
                    <p>Status: ${data.status}</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            'adoption-withdrawn': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Adoption Application Withdrawn</h2>
                    <p>Dear ${data.customerInfo.name},</p>
                    <p>Your adoption application${data.dog.name ? ` for ${data.dog.name}` : ''} has been withdrawn.</p>
                    <p>Application ID: ${data._id}</p>
                    <p>If this was a mistake, please submit a new application.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            // Rehoming templates
            'rehoming-created': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Thank You for Your Rehoming Application</h2>
                    <p>Dear ${data.ownerInfo.firstName},</p>
                    <p>We have received your rehoming application for ${data.petInfo.name}.</p>
                    <p>Application ID: ${data._id}</p>
                    <p>We will review your application and contact you soon.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            'rehoming-updated': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Rehoming Application Updated</h2>
                    <p>Dear ${data.ownerInfo.firstName},</p>
                    <p>Your rehoming application for ${data.petInfo.name} has been updated.</p>
                    <p>Application ID: ${data._id}</p>
                    <p>Status: ${data.status}</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            'rehoming-withdrawn': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Rehoming Application Withdrawn</h2>
                    <p>Dear ${data.ownerInfo.firstName},</p>
                    <p>Your rehoming application for ${data.petInfo.name} has been withdrawn.</p>
                    <p>Application ID: ${data._id}</p>
                    <p>If this was a mistake, please submit a new application.</p>
                    <p>Best regards,<br>Dog Cafe Team</p>
                </div>
            `,
            // Reservation templates
            'reservation-confirmation': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Reservation ${data.isModification ? 'Update' : 'Confirmation'}</h2>
                    <p>Dear ${data.customerInfo.name},</p>
                    <p>Your reservation has been ${data.isModification ? 'updated' : 'confirmed'} for:</p>
                    <ul>
                        <li>Date: ${new Date(data.date).toLocaleDateString()}</li>
                        <li>Time: ${data.timeSlot}</li>
                        <li>Number of People: ${data.numberOfPeople}</li>
                        <li>Services: ${data.selectedServices.join(', ')}</li>
                    </ul>
                    <p>Thank you for choosing Dog Cafe!</p>
                </div>
            `,
            'reservation-cancelled': `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Reservation Cancellation</h2>
                    <p>Dear ${data.customerInfo.name},</p>
                    <p>Your reservation has been cancelled:</p>
                    <ul>
                        <li>Date: ${new Date(data.date).toLocaleDateString()}</li>
                        <li>Time: ${data.timeSlot}</li>
                        <li>Number of People: ${data.numberOfPeople}</li>
                        <li>Services: ${data.selectedServices.join(', ')}</li>
                    </ul>
                    <p>If you did not request this cancellation, please contact us immediately.</p>
                    <p>We hope to see you another time at Dog Cafe!</p>
                </div>
            `,
            // Verification template
            verification: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Welcome to Dog Cafe!</h2>
                    <p>Your verification code is: <strong>${data.code}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        };
        return templates[type] || templates['verification'];
    }
};

module.exports = emailService;