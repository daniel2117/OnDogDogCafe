const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ 
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
});

let bucket;

const gridfsStorage = {
    init: () => {
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
    },

    upload,

    async saveFile(file, type) {
        const filename = `${Date.now()}-${file.originalname}`;
        let buffer = file.buffer;

        // If it's an image, optimize it
        if (file.mimetype.startsWith('image/')) {
            buffer = await sharp(file.buffer)
                .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
        }

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: file.mimetype,
            metadata: { type }
        });

        await new Promise((resolve, reject) => {
            uploadStream.end(buffer, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        return {
            filename,
            fileId: uploadStream.id,
            url: `/api/files/${uploadStream.id}`
        };
    },

    async getFile(fileId) {
        return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    },

    async deleteFile(fileId) {
        await bucket.delete(new mongoose.Types.ObjectId(fileId));
    },

    async listFiles(type) {
        const files = await bucket.find({ 'metadata.type': type }).toArray();
        return files.map(file => ({
            fileId: file._id,
            filename: file.filename,
            url: `/api/files/${file._id}`
        }));
    }
};

module.exports = gridfsStorage;
