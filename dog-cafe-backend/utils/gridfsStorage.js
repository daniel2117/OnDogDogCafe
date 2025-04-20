const multer = require('multer');

const storage = multer.memoryStorage();

module.exports = {
    upload: multer({ 
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
            files: 5 // Maximum 5 files
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only images are allowed'), false);
            }
        }
    })
};
