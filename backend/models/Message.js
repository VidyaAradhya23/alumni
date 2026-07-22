const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    encrypted_text: {
        type: String
    },
    attachment: {
        url: { type: String, default: '' },
        type: { type: String, default: '' }, // 'image', 'document', 'file'
        name: { type: String, default: '' }
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound indexes for ultra-fast chat thread queries and unread counting
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
