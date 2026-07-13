const ActivityLog = require('../models/ActivityLog');

const activityLogger = async (req, res, next) => {
    // Only log POST, PUT, DELETE requests (modifications) to avoid spamming from GET requests
    const loggableMethods = ['POST', 'PUT', 'DELETE'];
    
    if (loggableMethods.includes(req.method)) {
        // Wait for the response to finish so we can capture the status code and final user
        res.on('finish', async () => {
            try {
                // Determine action type based on method and endpoint
                let actionType = 'UNKNOWN';
                if (req.originalUrl.includes('/api/auth/login')) actionType = 'LOGIN';
                else if (req.originalUrl.includes('/api/auth/register')) actionType = 'REGISTER';
                else if (req.originalUrl.includes('/api/posts') && req.method === 'POST') actionType = 'CREATE_POST';
                else if (req.originalUrl.includes('/api/auth/profile') && req.method === 'PUT') actionType = 'UPDATE_PROFILE';
                else if (req.originalUrl.includes('/api/upload')) actionType = 'UPLOAD_MEDIA';
                else actionType = `${req.method}_API_CALL`;

                // Mask passwords from metadata
                const metadata = { ...req.body };
                if (metadata.password) metadata.password = '***';
                if (metadata.currentPassword) metadata.currentPassword = '***';
                if (metadata.newPassword) metadata.newPassword = '***';

                await ActivityLog.create({
                    user: req.user ? req.user._id : null, // req.user is set by authMiddleware if authenticated
                    actionType,
                    method: req.method,
                    endpoint: req.originalUrl,
                    metadata: metadata,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent'),
                    status: res.statusCode
                });
            } catch (error) {
                console.error('Activity Logging Error:', error);
            }
        });
    }
    next();
};

module.exports = activityLogger;
