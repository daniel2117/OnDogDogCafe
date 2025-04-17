const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Enhanced error logging
    console.error({
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });

    // Structured error response
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        errorCode: err.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler;