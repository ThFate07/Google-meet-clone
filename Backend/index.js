import { connectDB } from './db/connectDB';
import router from './routes/route'


const express = require('express');

const app = express()



// connect to database
connectDB()

// routes
app.use('/', router)

app.listen(3000 , () => { 
    console.log('started listening on port 3000')
})