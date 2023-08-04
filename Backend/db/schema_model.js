const mongoose = require('mongoose')

const userSchema = mongoose.Schema( { 
    username : String,
    password : String
})

const meetingSchema = mongoose.Schema({ 
    _id : String,
})

const user = mongoose.model('user' , userSchema);
const Meeting = mongoose.model('Meeting' , meetingSchema)

module.exports = {user , Meeting, userSchema, meetingSchema}