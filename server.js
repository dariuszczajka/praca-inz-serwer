const express = require('express')
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const cors = require('cors')
const path = require('path')


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
app.use(cors())
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'user_upload')))

app.listen(5000, () => {
    console.log(`Server Started at ${5000}`)
})

// offers
const offerRouter = require('./routes/offer')
app.use('/offer', offerRouter)

// users
const userRouter = require('./routes/user')
app.use('/user', userRouter)

// categories
const categoryRouter = require('./routes/category')
app.use('/category', categoryRouter)
