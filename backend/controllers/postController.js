const Post = require('../models/Post');
const BlockedUser = require('../models/BlockedUser');
const Notification = require('../models/Notification');

// @desc    Get all posts
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
    try {
        // Fetch users the current user has blocked or who have blocked the current user
        const blockedRecords = await BlockedUser.find({
            $or: [{ blocker: req.user._id }, { blocked: req.user._id }]
        });
        
        const blockedUserIds = blockedRecords.map(record => {
            return record.blocker.toString() === req.user._id.toString() 
                ? record.blocked 
                : record.blocker;
        });

        const posts = await Post.find({ user: { $nin: blockedUserIds } })
            .populate('user', 'name branch department batchYear avatar_url username')
            .populate('tags', 'name username avatar_url')
            .populate('comments.user', 'name avatar_url username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
    const { content, image, fileType, fileName, tags } = req.body;

    try {
        const post = await Post.create({
            user: req.user._id,
            content,
            image,
            fileType,
            fileName,
            tags: Array.isArray(tags) ? tags : []
        });

        const fullPost = await post.populate([
            { path: 'user', select: 'name branch department batchYear avatar_url username' },
            { path: 'tags', select: 'name username avatar_url' }
        ]);

        // Create notifications for tagged users
        if (Array.isArray(tags) && tags.length > 0) {
            const notifications = tags.map(tagId => ({
                recipient: tagId,
                sender: req.user._id,
                type: 'mention',
                title: 'You were tagged in a post',
                message: `${req.user.name || 'A connection'} tagged you in a new post.`
            }));
            await Notification.insertMany(notifications);
        }

        res.status(201).json(fullPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the current user owns the post OR is an admin
        if (post.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: req.user._id,
            text: text.trim(),
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate('user', 'name branch department batchYear avatar_url')
            .populate('comments.user', 'name avatar_url');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle save post for user
// @route   PUT /api/posts/:id/save
exports.toggleSavePost = async (req, res) => {
    try {
        const user = req.user;
        const postId = req.params.id;
        
        const isSaved = user.savedPosts && user.savedPosts.includes(postId);
        
        if (isSaved) {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
        } else {
            if (!user.savedPosts) user.savedPosts = [];
            user.savedPosts.push(postId);
        }
        
        await user.save();
        res.json({ savedPosts: user.savedPosts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post settings (archive, hide counts, disable comments, pin)
// @route   PUT /api/posts/:id/settings
exports.updatePostSettings = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this post' });
        }
        
        const { isArchived, hideLikeCount, hideShareCount, commentsDisabled, isPinned } = req.body;
        
        if (isArchived !== undefined) post.isArchived = isArchived;
        if (hideLikeCount !== undefined) post.hideLikeCount = hideLikeCount;
        if (hideShareCount !== undefined) post.hideShareCount = hideShareCount;
        if (commentsDisabled !== undefined) post.commentsDisabled = commentsDisabled;
        if (isPinned !== undefined) post.isPinned = isPinned;
        
        await post.save();
        
        const updatedPost = await Post.findById(req.params.id)
            .populate('user', 'name branch department batchYear avatar_url')
            .populate('comments.user', 'name avatar_url');
            
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Edit a post content
// @route   PUT /api/posts/:id/edit
exports.editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to edit this post' });
        }
        
        const { content } = req.body;
        if (content !== undefined) {
            post.content = content;
        }
        
        await post.save();
        
        const updatedPost = await Post.findById(req.params.id)
            .populate('user', 'name branch department batchYear avatar_url')
            .populate('comments.user', 'name avatar_url');
            
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
