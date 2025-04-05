const languageMiddleware = (req, res, next) => {
    req.language = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
    next();
};

module.exports = languageMiddleware;