const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userID: String,
    sessionCreated: {
        type: Date,
        default: Date.now
    },
    sessionExpires: {
        type: Date,
        default: Date.now() + 7*24*60*60*1000 // expiration date for each session is 7 days
    }
})

module.exports = mongoose.model('session', SessionSchema, 'sessions')