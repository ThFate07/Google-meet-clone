const connectDB = require('./db/connectDB')
const router = require('./routes/route')
const cors = require("cors");
const bodyParser = require('body-parser')
const express = require('express');

const app = express()

app.use(bodyParser.json())
app.use(cors())

// connect to database
connectDB()

// routes
app.use('/', router)

app.listen(3000 , () => { 
    console.log('started listening on port 3000')
})