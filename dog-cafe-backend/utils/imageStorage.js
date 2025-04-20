const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const STORAGE_DIR = process.env.NODE_ENV === 'production'
    ? '/opt/render/project/src/uploads'  // Render's persistent disk path
    : path.join(__dirname, '..', 'uploads');

const imageStorage = {
    async init() {
        await fs.mkdir(STORAGE_DIR, { recursive: true });
    },

    async saveImage(file, options = {}) {
        const fileName = `${crypto.randomUUID()}.webp`;
        const filePath = path.join(STORAGE_DIR, fileName);

        // Optimize image using sharp
        await sharp(file.buffer)
            .resize({
                width: options.width || 800,
                height: options.height || 800,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(filePath);

        return {
            fileName,
            url: `/images/${fileName}`
        };
    },

    async getImage(fileName) {
        const filePath = path.join(STORAGE_DIR, fileName);
        try {
            return await fs.readFile(filePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error('Image not found');
            }
            throw error;
        }
    },

    async deleteImage(fileName) {
        const filePath = path.join(STORAGE_DIR, fileName);
        await fs.unlink(filePath);
    }
};

module.exports = imageStorage;
