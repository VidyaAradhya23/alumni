const mongoose = require('mongoose');

const studentDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    joiningYear: { type: String, required: true },
    leavingYear: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StudentData', studentDataSchema);
