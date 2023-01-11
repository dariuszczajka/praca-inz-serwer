const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    img: Array,
    lat: Number,
    lon: Number,
    locationDetails: Object,
    postDate: Date,
    ownerID: String
})

module.exports = mongoose.model('offer', offerSchema, 'offers')