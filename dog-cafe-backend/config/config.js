require('dotenv').config();

module.exports = {
    port: process.env.PORT || 10000,
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/dogcafe',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    },
    admin: {
        secret: process.env.ADMIN_SECRET || 'admin123secretkey'
    },
    smtp: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    },
    from: process.env.EMAIL_FROM || '"Dog Cafe" <noreply@dogcafe.com>'
};