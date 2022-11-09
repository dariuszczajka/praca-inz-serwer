const express = require("express");
const offerModel = require('../model/offerModel');
const offerRoutes = express.Router();

offerRoutes.get( "/all", async (req, res) => {

    const offers = await offerModel.find({});
    console.log(offers);
    res.header("Access-Control-Allow-Origin", "*");
    res.json(offers);
});

offerRoutes.post( "/new", async (req, res) => {
    const data = new offerModel({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        img: req.body.img,
        //TODO: modul przesylania obrazkow na serwer
        lon: req.body.lon,
        lat: req.body.lat,
        postDate: Date.now()
    })

    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});


module.exports = offerRoutes


