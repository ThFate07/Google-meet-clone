const mongoose = require("mongoose");

function connectDB() { 
    try { 
        mongoose.connect('mongodb+srv://thfate:7715821250@cluster0.y4ypebz.mongodb.net/googlemeet')
    } catch  { 
        console.log("couldn't connect to database. please try again later")
    }
}

module.exports = connectDB