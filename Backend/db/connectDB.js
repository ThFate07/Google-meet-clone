import mongoose from "mongoose";

export function connectDB() { 
    try { 
        mongoose.connect('mongodb://127.0.0.1:27017/googlemeet')
    } catch  { 
        console.log("couldn't connect to database. please try again later")
    }
}

