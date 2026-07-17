const mongoose = require('mongoose');
require('dotenv').config();
const { syncStudents } = require('./controllers/syncController');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const req = {};
        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(`Status: ${code}`);
                    console.log(data);
                    process.exit(0);
                }
            })
        };
        
        await syncStudents(req, res);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
