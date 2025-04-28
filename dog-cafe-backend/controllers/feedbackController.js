const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');
const { sendEmail } = require('../utils/notifications');

const feedbackController = {
    submitFeedback: asyncHandler(async (req, res) => {
        const { email, name, rating, comment } = req.body;

        const feedback = await Feedback.create({
            email,
            name,
            rating,
            comment
        });

        // Send confirmation email
        await sendEmail(
            email,
            'Thank You for Your Feedback - Dog Cafe',
            `Dear ${name},\n\nThank you for sharing your feedback with us. Your opinion helps us improve our services.\n\nBest regards,\nDog Cafe Team`
        );

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: {
                id: feedback._id,
                email: feedback.email,
                name: feedback.name,
                rating: feedback.rating
            }
        });
    }),

    getFeedbackById: asyncHandler(async (req, res) => {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            res.status(404);
            throw new Error('Feedback not found');
        }
        res.json(feedback);
    }),

    getFeedbackList: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const [feedbacks, total] = await Promise.all([
            Feedback.find()
                .select('email name rating comment createdAt')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Feedback.countDocuments()
        ]);

        res.json({
            feedbacks,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    // Admin routes
    getAllFeedback: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const serviceType = req.query.serviceType;

        const filter = {};
        if (status) filter.status = status;
        if (serviceType) filter.serviceType = serviceType;

        const [feedbacks, total] = await Promise.all([
            Feedback.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Feedback.countDocuments(filter)
        ]);

        res.json({
            feedbacks,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    respondToFeedback: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { adminResponse } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            {
                adminResponse,
                status: 'responded'
            },
            { new: true }
        );

        if (!feedback) {
            res.status(404);
            throw new Error('Feedback not found');
        }

        // Send notification email to user
        await sendEmail(
            feedback.userEmail,
            'Response to Your Feedback - Dog Cafe',
            `Dear ${feedback.userName},\n\nWe have responded to your feedback:\n\n"${adminResponse}"\n\nThank you for helping us improve.\n\nBest regards,\nDog Cafe Team`
        );

        res.json(feedback);
    })
};

module.exports = feedbackController;
