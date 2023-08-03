export const userSchema = mongoose.Schema( { 
    username : String,
    password : String
})

export const meetingSchema = mongoose.Schema({ 
    _id : String,
})

export const user = mongoose.model('user' , userSchema);
export const Meeting = mongoose.model('Meeting' , meetingSchema)