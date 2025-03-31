const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No valid token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
