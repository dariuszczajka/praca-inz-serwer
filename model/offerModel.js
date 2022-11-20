const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    //img: String,
    img: Array,
    lat: Number,
    lon: Number,
    postDate: Date
})

module.exports = mongoose.model('offer', offerSchema, 'offers')