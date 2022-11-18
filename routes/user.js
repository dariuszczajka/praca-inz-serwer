const express = require("express");
const userModel = require('../model/userModel');
const sessionModel = require('../model/sessionModel');
const {getDB} = require("../databaseConnection");
const userRoutes = express.Router();


userRoutes.post('/register', (req, res) => {
    const data = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        registrationDate: Date.now()
    })

    if((req.body.userLon != null || req.body.userLon !== '') &&
        (req.body.userLat != null || req.body.userLat !== '')){
        data.userLon = req.body.userLon
        data.userLat = req.body.userLat
    } else{
        data.userProfileLocation = req.body.userProfileLocation;
    }

    try {
        console.log(data);
        data.save();
        console.log('udalo sie kod 200')
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({message: 'user created'})
    }
    catch (error) {
        console.log('kod 400')
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400).json({message: error.message})
    }
})

userRoutes.post( "/login", async (req, res) => {
    const user = await userModel.findOne({username: req.body.username});
    console.log(user);
    if(user === null){
        res.header("Access-Control-Allow-Origin", "*");
        res.status(404).json({message: 'user account not found'})
    }
    else{
        if(user.username === req.body.username &&
            user.password === req.body.password){

            const token = new sessionModel({
                userID: user._id
            })

            await token.save()

            console.log(token._id);
            console.log(user._id);

            const updatedUser = await userModel.findOneAndUpdate({_id: user._id}, {$set: { sessionToken : token._id}});
            updatedUser.save()

            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).json({
                username: updatedUser.username,
                sessionToken: updatedUser.sessionToken,
                validFrom: token.sessionCreated,
                validTo: token.sessionExpires
            });
        }else{
            res.header("Access-Control-Allow-Origin", "*");
            res.status(401).json({message: 'incorrect password'})
        }
    }
});

module.exports = userRoutes
