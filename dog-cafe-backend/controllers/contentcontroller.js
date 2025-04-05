const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const BusinessInfo = require('../models/BusinessInfo');

const contentController = {
    getServices: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const services = await Service.find({ isActive: true });
        res.json(services.map(service => ({
            id: service._id,
            name: service.name[lang],
            description: service.description[lang],
            image: service.image,
            pricing: service.pricing
        })));
    }),

    getBusinessInfo: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const info = await BusinessInfo.findOne();
        res.json({
            name: info.name[lang],
            address: info.address[lang],
            contact: info.contact,
            openingHours: info.openingHours,
            location: info.location
        });
    })
};

module.exports = contentController;