const express = require("express");
const userModel = require('../model/userModel');
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
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

userRoutes.post( "/login", async (req, res) => {
    const user = await userModel.findOne({username: req.body.username});
    console.log(user);
    if(user === null){
        res.status(404).json({message: 'user account not found'})
    }

    if(user.username === req.body.username &&
        user.password === req.body.password){
        console.log('user logged in!');
        //TODO: set a cookie for user/ create a session in db
        res.status(200).json({message: 'all good'});
    }else{
        res.status(401).json({message: 'incorrect password'})
    }
});

module.exports = userRoutes
