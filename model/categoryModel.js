const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema({
    namePL: String,
    nameEN: String,
    icon: String
})

module.exports = mongoose.model('category', categoryModel, 'categories')