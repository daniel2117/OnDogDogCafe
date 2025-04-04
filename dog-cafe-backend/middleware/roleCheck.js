const roleCheck = (role) => {
    return (req, res, next) => {
        if (!req.user.role || req.user.role !== role) {
            return res.status(403).json({
                message: 'Not authorized to access this resource'
            });
        }
        next();
    };
};

module.exports = { roleCheck };