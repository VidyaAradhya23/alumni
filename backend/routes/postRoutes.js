const express = require('express');
const { getPosts, createPost, likePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
