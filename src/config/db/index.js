const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_learning');
        console.log('Connecte successfully');
    } catch (err) {
        console.log('Connect failed');
    }
}

module.exports = { connect };
