const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Set up storage directory - Render uses /opt/render/project/src for persistent storage
const STORAGE_DIR = process.env.NODE_ENV === 'production' 
    ? '/opt/render/project/src/uploads'
    : path.join(__dirname, '..', 'uploads');

// Ensure storage directory exists
const initStorage = async () => {
    try {
        await fs.mkdir(STORAGE_DIR, { recursive: true });
        console.log('Storage directory initialized:', STORAGE_DIR);
    } catch (error) {
        console.error('Failed to initialize storage directory:', error);
        throw error;
    }
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, STORAGE_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

const listFiles = async (type) => {
    const directoryPath = path.join(STORAGE_DIR, type);
    try {
        const files = await fs.readdir(directoryPath);
        return files.map(filename => ({
            url: `/uploads/${type}/${filename}`,
            filename
        }));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const localImageStorage = {
    init: initStorage,
    upload,

    async saveImage(file) {
        const relativePath = path.relative(STORAGE_DIR, file.path);
        return {
            url: `/images/${relativePath}`,
            fileName: file.filename
        };
    },

    async getImage(filename) {
        const filePath = path.join(STORAGE_DIR, filename);
        return fs.readFile(filePath);
    },

    async deleteImage(filename) {
        const filePath = path.join(STORAGE_DIR, filename);
        await fs.unlink(filePath);
    },

    listFiles
};

module.exports = localImageStorage;
