const express = require('express')
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

// database
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})

// express boilerplate
const app = express();
app.use(express.json());

app.listen(5000, () => {
    console.log(`Server Started at ${5000}`)
})

// offers
const offerRouter = require('./routes/offer')
app.use('/offer', offerRouter)

// users
const userRouter = require('./routes/user')
app.use('/user', userRouter)