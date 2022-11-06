const mongoose = require('mongoose');

const SessionModel = new mongoose.Schema({
    username: String,
    userDatabaseId: String,
    sessionStart: {
        type: Date,
        default: Date.now
    },
    sessionExpires: {
        type: Date,
        default: Date.now + (60*60*1000)
    }
})

module.exports = mongoose.model('session', SessionModel, 'sessions')