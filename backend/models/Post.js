const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { 
        type: String, 
        required: function() { return !this.image; } 
    },
    image: { type: String },
    fileType: { type: String },
    fileName: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    isArchived: { type: Boolean, default: false },
    hideLikeCount: { type: Boolean, default: false },
    hideShareCount: { type: Boolean, default: false },
    commentsDisabled: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Index for fast timeline feed sorting
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
