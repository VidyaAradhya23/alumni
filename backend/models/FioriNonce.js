const mongoose = require('mongoose');

const fioriNonceSchema = new mongoose.Schema({
    nonce: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120 // TTL index: document will be automatically deleted after 120 seconds
    }
});

module.exports = mongoose.model('FioriNonce', fioriNonceSchema);
