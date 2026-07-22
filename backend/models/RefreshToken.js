const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    deviceInfo: {
        ip: String,
        userAgent: String,
        deviceName: String
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-purge when expired
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    replacedByToken: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
