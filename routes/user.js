const express = require("express");
const userModel = require('../model/userModel');
const sessionModel = require('../model/sessionModel');
const {getDB} = require("../databaseConnection");
const userRoutes = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config({ path: 'config.env' });

userRoutes.post('/register', async (req, res) => {
    let salt = bcrypt.genSaltSync(10);
    const password = await bcrypt.hash(req.body.password,salt);

    const data = new userModel({
        username: req.body.username,
        password: password,
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

const verifyUserLogin = async (username,password)=>{
    try {
        const user = await userModel.findOne({username}).lean()
        if(!user){
            return {status:'error',error:'user not found'}
        }
        if(await bcrypt.compare(password,user.password)){
            // creating a JWT token
            token = jwt.sign({id:user._id,username:user.username,type:'user'},process.env.JWT_SECRET,{ expiresIn: '2h'})
            console.log(token);
            return {username:user.username,status:'ok',data:token, userId: user._id}
        }
        return {status:'error',error:'invalid password'}
    } catch (error) {
        console.log(error);
        return {status:'error',error:'timed out'}
    }
}

userRoutes.post( "/login", async (req, res) => {
    const user = await userModel.findOne({username: req.body.username});
    console.log(user);
    if(user === null){
        res.header("Access-Control-Allow-Origin", "*");
        res.status(404).json({message: 'user account not found'})
    }
    else{
        const response = await verifyUserLogin(req.body.username,req.body.password);
        if(response.status==='ok'){
            // storing our JWT web token as a cookie in our browser
            res.cookie('token',token,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });  // maxAge: 2 hours
            res.json(response);
        }else{
            res.json(response);
        }}
});

module.exports = userRoutes
