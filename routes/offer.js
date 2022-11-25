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
        //TODO: naprawa category
        //category: categoryModel.find({_id: req.body.category}),
        name: req.body.category,
        desc: req.body.desc,
        price: req.body.price,
        //img: req.body.img,
        //TODO: modul przesylania obrazkow na serwer
        lon: req.body.lon,
        lat: req.body.lat,
        postDate: Date.now()
    })

    try {
        console.log(data._id);
        data.save();
        res.status(200).json(data._id);
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
    console.log('upload file!')
    console.log(req.body.offerID)
    //check if userToken is valid

    // user/token validation
    /*let inputDate = new Date().toISOString();
    console.log('sessiontoken found: ' + req.body.sessionToken);
    console.log('userID found: ' + req.body.userID);
    const session = await sessionModel.findOne({
        __id: req.body.sessionToken,
        userID: req.body.userID,
        sessionExpires: { $gte: inputDate }
    });

    console.log('sessions found: ' + session);*/

    //check if offerId is valid and not already max amount of pictures
    const offer = await offerModel.findOne({
        _id: req.body.offerID
    })

    if(!offer) return res.sendStatus(400);

    // Get the file that was set to our field named "image"
    const {image} = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(402);
    // If file uploaded is not an image, exit
    // TODO: image validation
    //if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    let filePath = path.join(__dirname, '..', '/user_upload/', req.body.offerID, '/');
    if (!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }

    let databaseURL = 'http://localhost:5000/static/' + req.body.offerID + '/';

/*    try {
        if (fs.existsSync(filePath)) {
             photoNumber = fs.readdirSync(filePath).length
        }
    } catch(err) {
        console.error(err)
    }*/

    let imageArray = [];

    if(Array.isArray(image)){
        console.log('it is an array');
        imageArray = image;
    }
    else{
        console.log('it not is an array');
        imageArray.push(image);
    }

    let filePathTemplate = filePath;
    let databaseURLTemplate = databaseURL;
    for (let i=0;i<imageArray.length;i++) {
        console.log(imageArray[i]);
        let imageName = i+1;
        filePath = filePathTemplate + imageName + '.' + imageArray[i].mimetype.split('/').slice(1);
        databaseURL = databaseURLTemplate + imageName + '.' + imageArray[i].mimetype.split('/').slice(1);

        // Move the uploaded image to our upload folder
        imageArray[i].mv(filePath);

        await offerModel.findOneAndUpdate({_id: req.body.offerID}, {$push: { img : databaseURL}});
    }
    res.sendStatus(200);
});

module.exports = offerRoutes


