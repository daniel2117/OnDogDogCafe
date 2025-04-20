const asyncHandler = require('express-async-handler');
const RehomingApplication = require('../models/RehomingApplication');
const localImageStorage = require('../utils/localImageStorage');
const { sendEmail } = require('../utils/notifications');
const Dog = require('../models/Dog');

const rehomingController = {
    uploadPhotos: asyncHandler(async (req, res) => {
        const photoUrls = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename
        }));
        res.status(201).json({ message: 'Photos uploaded successfully', photoUrls });
    }),

    uploadDocuments: asyncHandler(async (req, res) => {
        const documentUrls = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename
        }));
        res.status(201).json({ message: 'Documents uploaded successfully', documentUrls });
    }),

    getUploadedFiles: asyncHandler(async (req, res) => {
        const { type } = req.query; // 'photos' or 'documents'
        if (!type || !['photos', 'documents'].includes(type)) {
            return res.status(400).json({ message: 'Invalid type parameter' });
        }

        const files = await localImageStorage.listFiles(type);
        res.json({ files });
    }),

    submitApplication: asyncHandler(async (req, res) => {
        const { photoUrls, documentUrls } = req.body;

        // Create application with uploaded file URLs
        const application = await RehomingApplication.create({
            ...req.body,
            media: {
                photos: photoUrls || [],
                documents: documentUrls || []
            }
        });

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

        // If application is approved, create a Dog entry
        if (status === 'approved') {
            await Dog.create({
                name: application.petInfo.name,
                breed: application.petInfo.breed,
                age: application.petInfo.age,
                size: application.petInfo.size,
                gender: application.petInfo.gender,
                color: application.petInfo.color,
                description: application.petInfo.description,
                images: application.media.photos, // Link rehoming images
                imageUrl: application.media.photos[0] || '', // Use the first photo as the main image
                personality: ['Friendly', 'Playful'], // Default personality traits
                requirements: ['Good with kids', 'Needs yard'], // Default requirements
                vaccinated: application.petInfo.checklist?.shotsUpToDate || false,
                neutered: application.petInfo.isSpayedNeutered || false,
                checklist: Object.entries(application.petInfo.checklist || {})
                    .filter(([_, value]) => value)
                    .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()), // Convert checklist keys to readable strings
                weight: 'Not specified', // Default weight
                height: 'Not specified', // Default height
                healthRecords: [], // Empty by default
                vaccinations: [], // Empty by default
                translations: {
                    zh: {
                        name: `狗狗${application.petInfo.name}`,
                        description: `一隻可愛的${application.petInfo.age}個月大的${application.petInfo.breed}`
                    }
                },
                health: ["General Health Check", "Vaccinations Up-to-date", "Deworming Treatment"], // Default health info
                status: 'available',
                createdAt: new Date()
            });
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
