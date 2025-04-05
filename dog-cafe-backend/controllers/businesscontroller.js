const asyncHandler = require('express-async-handler');
const BusinessInfo = require('../models/BusinessInfo');

const businessController = {
    getBusinessInfo: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const info = await BusinessInfo.findOne();
        
        if (!info) {
            res.status(404);
            throw new Error('Business information not found');
        }

        res.json({
            name: info.name[lang],
            address: info.address[lang],
            contact: {
                phone: info.contact.phone,
                email: info.contact.email
            },
            openingHours: info.openingHours,
            location: info.location,
            socialMedia: info.socialMedia
        });
    })
};

module.exports = businessController;