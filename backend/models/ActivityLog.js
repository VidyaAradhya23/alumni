const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false // Might be null for unauthenticated actions like login failures
    },
    actionType: { 
        type: String, 
        required: true 
    },
    method: {
        type: String,
        required: true
    },
    endpoint: { 
        type: String, 
        required: true 
    },
    metadata: { 
        type: mongoose.Schema.Types.Mixed, // Store any dynamic data (body, params)
        default: {}
    },
    ipAddress: { 
        type: String 
    },
    userAgent: {
        type: String
    },
    status: {
        type: Number // HTTP status code
    }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
