const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phoneNumber: String,
    userLon: Number,
    userLat: Number,
    userProfileLocation: String,
    registrationDate: Date,
    sessionToken: String,
    lastLogin: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user', UserSchema, 'users')