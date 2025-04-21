const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

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
    init: (db) => {
        if (!db) {
            throw new Error('Database connection is required');
        }
        bucket = new GridFSBucket(db, {
            bucketName: 'uploads'
        });
        console.log('GridFS storage initialized');
    },

    upload,

    async saveFile(file, type) {
        const filename = `${Date.now()}-${file.originalname}`;
        const buffer = file.buffer;

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

    async getFileInfo(fileId) {
        const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (files.length === 0) {
            return null;
        }
        return {
            fileId: files[0]._id,
            filename: files[0].filename,
            contentType: files[0].contentType,
            metadata: files[0].metadata,
            uploadDate: files[0].uploadDate,
            length: files[0].length
        };
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
