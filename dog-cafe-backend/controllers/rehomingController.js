const asyncHandler = require('express-async-handler');
const RehomingApplication = require('../models/RehomingApplication');
const { sendEmail } = require('../utils/notifications');

const rehomingController = {
    submitApplication: asyncHandler(async (req, res) => {
        const application = await RehomingApplication.create(req.body);

        // Send confirmation email
        await sendEmail(
            application.ownerInfo.email,
            'Rehoming Application Received',
            `Dear ${application.ownerInfo.firstName},\n\nThank you for submitting a rehoming application for ${application.petInfo.name}. We will review your application and contact you soon.\n\nBest regards,\nDog Cafe Team`
        );

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: application._id
        });
    }),

    getApplicationById: asyncHandler(async (req, res) => {
        const application = await RehomingApplication.findById(req.params.id);
        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }
        res.json(application);
    }),

    getApplicationsByEmail: asyncHandler(async (req, res) => {
        const applications = await RehomingApplication.find({
            'ownerInfo.email': req.query.email
        }).sort({ createdAt: -1 });
        res.json(applications);
    }),

    updateApplication: asyncHandler(async (req, res) => {
        const application = await RehomingApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }
        res.json(application);
    }),

    // Admin endpoints
    getAllApplications: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filter = {};
        if (status) filter.status = status;

        const [applications, total] = await Promise.all([
            RehomingApplication.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            RehomingApplication.countDocuments(filter)
        ]);

        res.json({
            applications,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    updateApplicationStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const application = await RehomingApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        // Send status update email
        await sendEmail(
            application.ownerInfo.email,
            'Rehoming Application Status Update',
            `Dear ${application.ownerInfo.firstName},\n\nYour rehoming application for ${application.petInfo.name} has been ${status}.\n\nBest regards,\nDog Cafe Team`
        );

        res.json(application);
    })
};

module.exports = rehomingController;
