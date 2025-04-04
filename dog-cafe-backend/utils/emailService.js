const nodemailer = require('nodemailer');
const config = require('../config/config');
const path = require('path');
const fs = require('fs').promises;
const Handlebars = require('handlebars');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport(config.email.smtp);
        this.templates = {};
    }

    async loadTemplate(templateName) {
        const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
        const template = await fs.readFile(templatePath, 'utf-8');
        this.templates[templateName] = Handlebars.compile(template);
    }

    async sendEmail(to, subject, templateName, data) {
        try {
            if (!this.templates[templateName]) {
                await this.loadTemplate(templateName);
            }

            const html = this.templates[templateName](data);

            const mailOptions = {
                from: config.email.from,
                to,
                subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendWelcomeEmail(user) {
        return this.sendEmail(
            user.email,
            'Welcome to Dog Cafe!',
            'welcome',
            { name: user.name }
        );
    }

    async sendReservationConfirmation(reservation, user) {
        return this.sendEmail(
            user.email,
            'Reservation Confirmation',
            'reservationConfirmation',
            {
                name: user.name,
                date: reservation.date,
                timeSlot: reservation.timeSlot,
                numberOfPeople: reservation.numberOfPeople,
                dogName: reservation.dog.name
            }
        );
    }

    async sendAdoptionApplicationConfirmation(application, user) {
        return this.sendEmail(
            user.email,
            'Adoption Application Received',
            'adoptionConfirmation',
            {
                name: user.name,
                dogName: application.dog.name,
                applicationId: application._id
            }
        );
    }

    async sendPasswordReset(user, resetToken) {
        return this.sendEmail(
            user.email,
            'Password Reset Request',
            'passwordReset',
            {
                name: user.name,
                resetLink: `${config.frontendUrl}/reset-password?token=${resetToken}`
            }
        );
    }

    async sendReservationReminder(reservation, user) {
        return this.sendEmail(
            user.email,
            'Upcoming Reservation Reminder',
            'reservationReminder',
            {
                name: user.name,
                date: reservation.date,
                timeSlot: reservation.timeSlot,
                dogName: reservation.dog.name
            }
        );
    }
}

module.exports = new EmailService();