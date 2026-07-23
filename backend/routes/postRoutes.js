const express = require('express');
const { getPosts, createPost, likePost, deletePost, addComment, toggleSavePost, updatePostSettings, editPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);
router.put('/:id/save', protect, toggleSavePost);
router.put('/:id/settings', protect, updatePostSettings);
router.put('/:id/edit', protect, editPost);

module.exports = router;
