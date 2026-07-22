const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        enum: ['logout', 'password_change', 'security_revoke', 'admin_revoke'],
        default: 'logout'
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // MongoDB TTL index — auto-deletes expired entries
    }
}, { timestamps: true });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
