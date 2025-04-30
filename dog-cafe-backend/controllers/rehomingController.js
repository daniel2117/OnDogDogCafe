const asyncHandler = require('express-async-handler');
const RehomingApplication = require('../models/RehomingApplication');
const gridfsStorage = require('../utils/gridfsStorage');
const { sendEmail } = require('../utils/notifications');
const Dog = require('../models/Dog');
const validators = require('../utils/validator');

const rehomingController = {
    uploadPhotos: asyncHandler(async (req, res) => {
        const photoUrls = await Promise.all(req.files.map(async file => {
            const savedFile = await gridfsStorage.saveFile(file, 'photos');
            return {
                url: savedFile.url,
                filename: savedFile.filename
            };
        }));
        
        res.status(201).json({
            message: 'Photos uploaded successfully',
            photoUrls: photoUrls.map(photo => photo.url)
        });
    }),

    uploadDocuments: asyncHandler(async (req, res) => {
        const documentUrls = await Promise.all(req.files.map(async file => {
            const savedFile = await gridfsStorage.saveFile(file, 'documents');
            return {
                url: savedFile.url,
                filename: savedFile.filename
            };
        }));
        
        res.status(201).json({
            message: 'Documents uploaded successfully',
            documentUrls: documentUrls.map(doc => doc.url)
        });
    }),

    getUploadedFiles: asyncHandler(async (req, res) => {
        const { type } = req.query;
        if (!type || !['photos', 'documents'].includes(type)) {
            return res.status(400).json({ message: 'Invalid type parameter' });
        }

        const files = await gridfsStorage.listFiles(type);
        res.json({ files });
    }),

    submitApplication: asyncHandler(async (req, res) => {
        // Validate the application
        const validation = validators.isValidRehomingApplication(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                message: 'Invalid application data',
                errors: validation.errors
            });
        }

        // Process file URLs to get GridFS IDs
        const photoIds = req.body.media.photos.map(url => {
            const segments = url.split('/');
            return segments[segments.length - 1]; // Extract ID from URL like '/api/files/123456...'
        }).filter(id => id); // Filter out any empty IDs

        if (photoIds.length === 0) {
            return res.status(400).json({
                message: 'At least one valid photo is required'
            });
        }

        try {
            // Fetch file info from GridFS
            const photoFiles = await Promise.all(
                photoIds.map(async (id) => {
                    const fileInfo = await gridfsStorage.getFileInfo(id);
                    if (!fileInfo) {
                        throw new Error(`File with ID ${id} not found`);
                    }
                    return fileInfo;
                })
            );

            // Create application with file references
            const application = await RehomingApplication.create({
                ...req.body,
                media: {
                    photos: photoFiles.map(file => `/api/files/${file.fileId}`),
                    documents: req.body.media.documents || []
                }
            });

            // Send confirmation email
            await emailService.sendRehomingApplicationConfirmation(
                application.ownerInfo.email,
                {
                    name: application.ownerInfo.firstName,
                    petName: application.petInfo.name,
                    applicationId: application._id,
                    status: 'received'
                }
            );

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: application._id
            });
        } catch (error) {
            console.error('Error processing rehoming application:', error);
            res.status(500).json({
                message: 'Failed to process application',
                error: error.message
            });
        }
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

    withdrawApplication: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const application = await RehomingApplication.findOne({
            _id: id,
            status: 'pending'  // Can only withdraw pending applications
        });

        if (!application) {
            return res.status(404).json({
                message: 'Active application not found'
            });
        }

        application.status = 'withdrawn';
        await application.save();

        // Send withdrawal confirmation email
        await emailService.sendRehomingApplicationConfirmation(
            application.ownerInfo.email,
            {
                name: application.ownerInfo.firstName,
                petName: application.petInfo.name,
                applicationId: application._id,
                status: 'withdrawn'
            }
        );

        res.json({
            message: 'Application withdrawn successfully',
            application: {
                id: application._id,
                status: application.status
            }
        });
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
        await emailService.sendRehomingApplicationConfirmation(
            application.ownerInfo.email,
            {
                name: application.ownerInfo.firstName,
                petName: application.petInfo.name,
                applicationId: application._id,
                status: status
            }
        );

        res.json(application);
    })
};

module.exports = rehomingController;
