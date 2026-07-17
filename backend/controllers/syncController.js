const StudentData = require('../models/StudentData');
const axios = require('axios');
const csv = require('csv-parser');

exports.syncStudents = async (req, res) => {
    try {
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1_55cfGQP3082nn29X2IJQIxwtqD6KTsHdw7Xwt5NESA/export?format=csv';
        const response = await axios.get(sheetUrl, { responseType: 'stream' });

        const results = [];
        response.data.pipe(csv())
            .on('data', (data) => {
                // Map keys from CSV to model
                if (data['Name'] && data['Joining Year'] && data['Leaving Year']) {
                    results.push({
                        name: data['Name'].trim().toLowerCase(),
                        joiningYear: data['Joining Year'].trim(),
                        leavingYear: data['Leaving Year'].trim()
                    });
                }
            })
            .on('end', async () => {
                try {
                    // Clear existing data and insert new
                    await StudentData.deleteMany({});
                    if (results.length > 0) {
                        await StudentData.insertMany(results);
                    }
                    res.status(200).json({ message: `Successfully synced ${results.length} student records from Mediacell.` });
                } catch (dbError) {
                    res.status(500).json({ message: 'Database error during sync', error: dbError.message });
                }
            })
            .on('error', (err) => {
                res.status(500).json({ message: 'Error parsing CSV data', error: err.message });
            });
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync student data', error: error.message });
    }
};
