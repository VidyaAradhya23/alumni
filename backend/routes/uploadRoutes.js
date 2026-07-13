const express = require('express');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();

let gfsBucket;

mongoose.connection.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

// @desc    Upload file to GridFS
// @route   POST /api/upload
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const ext = path.extname(req.file.originalname);
        const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;

        const uploadStream = gfsBucket.openUploadStream(filename, {
            contentType: req.file.mimetype
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', () => {
            const fileUrl = `/api/upload/${filename}`;
            res.status(201).json({
                message: 'File uploaded successfully',
                url: fileUrl
            });
        });

        uploadStream.on('error', (err) => {
            res.status(500).json({ message: 'Error uploading file', error: err.message });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get file from GridFS
// @route   GET /api/upload/:filename
router.get('/:filename', async (req, res) => {
    try {
        if (!gfsBucket) {
            return res.status(500).json({ message: 'GridFS not initialized' });
        }

        const file = await gfsBucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }

        // Set content type
        res.set('Content-Type', file[0].contentType);

        // Read from GridFS
        const readStream = gfsBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
