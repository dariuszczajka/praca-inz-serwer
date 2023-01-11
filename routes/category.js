const express = require("express");
const categoryModel = require('../model/categoryModel');
const categoryRoutes = express.Router();

categoryRoutes.get( "/all", async (req, res) => {
    const offers = await categoryModel.find({});
    res.header("Access-Control-Allow-Origin", "*");
    res.json(offers);
});


module.exports = categoryRoutes
