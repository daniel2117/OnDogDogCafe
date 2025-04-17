const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const BusinessInfo = require('../models/BusinessInfo');
const cache = require('../utils/cache');
const Content = require('../models/Content');

const contentController = {
    getServices: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const cacheKey = `services:${lang}`;

        try {
            // Try to get from cache
            const cached = await cache.get(cacheKey);
            if (cached) {
                return res.json(cached);
            }

            const services = await Service.find({ isActive: true });
            const response = services.map(service => ({
                id: service._id,
                name: service.name[lang],
                description: service.description[lang],
                image: service.image,
                pricing: service.pricing
            }));

            // Cache for 1 hour since this data rarely changes
            await cache.set(cacheKey, response, 3600);
            res.json(response);
        } catch (error) {
            console.error('Error fetching services:', error);
            res.status(500).json({
                message: 'Failed to fetch services',
                error: error.message
            });
        }
    }),

    getBusinessInfo: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const cacheKey = `businessInfo:${lang}`;

        try {
            // Try to get from cache
            const cached = await cache.get(cacheKey);
            if (cached) {
                return res.json(cached);
            }

            const info = await BusinessInfo.findOne();
            const response = {
                name: info.name[lang],
                address: info.address[lang],
                contact: info.contact,
                openingHours: info.openingHours,
                location: info.location
            };

            // Cache for 1 hour since this data rarely changes
            await cache.set(cacheKey, response, 3600);
            res.json(response);
        } catch (error) {
            console.error('Error fetching business info:', error);
            res.status(500).json({
                message: 'Failed to fetch business info',
                error: error.message
            });
        }
    }),

    getTerms: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const terms = await Content.findOne({ type: 'terms' });
        if (!terms) {
            res.status(404);
            throw new Error('Terms not found');
        }
        res.json({ content: terms.content[lang] });
    }),

    getPrivacyPolicy: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const privacy = await Content.findOne({ type: 'privacy' });
        if (!privacy) {
            res.status(404);
            throw new Error('Privacy policy not found');
        }
        res.json({ content: privacy.content[lang] });
    })
};

module.exports = contentController;