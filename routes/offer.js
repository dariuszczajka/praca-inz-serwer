const express = require("express");
const offerModel = require('../model/offerModel');
const offerRoutes = express.Router();
const fileUpload = require('express-fileupload');
const path = require("path");
const sessionModel = require("../model/sessionModel");
const userModel = require("../model/userModel");
const fs = require('fs')

offerRoutes.get( "/all", async (req, res) => {

    const offers = await offerModel.find({});
    res.header("Access-Control-Allow-Origin", "*");
    res.json(offers);
});

offerRoutes.post( "/new", async (req, res) => {
    const data = new offerModel({
        name: req.body.name,
        category: categoryModel.find({_id: req.body.category}),
        desc: req.body.desc,
        price: req.body.price,
        //img: req.body.img,
        //TODO: modul przesylania obrazkow na serwer
        //lon: req.body.lon,
        //lat: req.body.lat,
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

offerRoutes.use(
    fileUpload({
        limits: {
            fileSize: 5000000, // Around 5MB
        },
        abortOnLimit: true,
    })
);

offerRoutes.post('/uploadFile', async (req, res) => {
    //check if userToken is valid
    let inputDate = new Date().toISOString();
    console.log('sessiontoken found: ' + req.body.sessionToken);
    console.log('userID found: ' + req.body.userID);
    const session = await sessionModel.findOne({
        __id: req.body.sessionToken,
        userID: req.body.userID,
        sessionExpires: { $gte: inputDate }
    });

    console.log('sessions found: ' + session);

    //check if offerId is valid and not already max amount of pictures
    const offer = await offerModel.findOne({
        __id: req.body.offerID
    })

    if(!offer) return res.sendStatus(400);

    // Get the file that was set to our field named "image"
    const {image} = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);
    // If file uploaded is not an image, exit
    // TODO: image validation
    //if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    let filePath = path.join(__dirname, '..', '/user_upload/', 'req.body.offerID');
    let photoNumber = '1';
    try {
        if (fs.existsSync(filePath)) {
             photoNumber = fs.readdirSync(filePath).length
        }
    } catch(err) {
        console.error(err)
    }
    console.log(photoNumber)

    // Move the uploaded image to our upload folder
    image.mv(path.join(filePath, '/' , photoNumber));

    res.sendStatus(200);
});

module.exports = offerRoutes


