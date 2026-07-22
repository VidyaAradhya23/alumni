const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Check if token has been blacklisted (user logged out or revoked)
            const isBlacklisted = await TokenBlacklist.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Super Admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
};

module.exports = { protect, adminOnly, superAdminOnly };

