const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const validators = require('../utils/validator');
const { sendEmail } = require('../utils/notifications');

const contactController = {
    submitInquiry: asyncHandler(async (req, res) => {
        // Validate form data
        const validation = validators.isValidContactForm(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                message: 'Invalid form data',
                errors: validation.errors
            });
        }

        // Create contact record
        const contact = await Contact.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            agreedToPrivacyPolicy: req.body.agreed // Map 'agreed' to 'agreedToPrivacyPolicy'
        });

        // Send confirmation email
        try {
            await sendEmail(
                contact.email,
                'Inquiry Received - Dog Cafe',
                `Dear ${contact.firstName},\n\nThank you for contacting us. We have received your inquiry and will get back to you as soon as possible.\n\nBest regards,\nDog Cafe Team`
            );
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            contactId: contact._id
        });
    }),

    // Admin endpoints
    getInquiries: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const [inquiries, total] = await Promise.all([
            Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Contact.countDocuments(filter)
        ]);

        res.json({
            inquiries,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    updateInquiryStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!inquiry) {
            res.status(404);
            throw new Error('Inquiry not found');
        }

        res.json(inquiry);
    })
};

module.exports = contactController;
