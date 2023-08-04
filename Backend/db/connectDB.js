const mongoose = require("mongoose");

function connectDB() { 
    try { 
        mongoose.connect('mongodb://127.0.0.1:27017/googlemeet')
    } catch  { 
        console.log("couldn't connect to database. please try again later")
    }
}

module.exports = connectDB