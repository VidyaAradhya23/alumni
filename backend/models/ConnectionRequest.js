const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    message: {
        type: String,
        default: 'Would like to connect with you on Alumni Network.'
    }
}, { timestamps: true });

connectionRequestSchema.index({ recipient: 1, status: 1 });
connectionRequestSchema.index({ sender: 1, recipient: 1 });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
