const Report = require('../models/Report');

// @desc    Create a report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
    try {
        const { reportedItem, itemType, reason } = req.body;

        const report = await Report.create({
            reporter: req.user._id,
            reportedItem,
            itemType,
            reason
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email')
            .sort({ createdAt: -1 });
            
        // We'd ideally populate reportedItem dynamically depending on itemType, 
        // but for now, admin can just see the ID and Type.
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id/status
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        await report.save();

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
