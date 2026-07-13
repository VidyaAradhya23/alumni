const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, adminOnly, getReports);
router.put('/:id/status', protect, adminOnly, updateReportStatus);

module.exports = router;
