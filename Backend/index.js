const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.json())
app.use(cors())
const secretKeyUser = 'thisismysecretkeyyoudontknowthis'
mongoose.connect('mongodb://127.0.0.1:27017/googlemeet')

const userSchema = mongoose.Schema( { 
    username : String,
    password : String
})

const meetingSchema = mongoose.Schema({ 
    _id : String,
})

const user = mongoose.model('user' , userSchema);
const Meeting = mongoose.model('Meeting' , meetingSchema)

app.post('/signup' , async (req , res) => { 
    let {username , password} = req.body;

    let isUser = await user.findOne({username})

    if (isUser) { 
        res.status(403).json({message : 'username not available.'});
        return;
    }
    const jwtToken = jwt.sign({username} , secretKeyUser , {expiresIn : '1hr'});

    let newUser = new user({ 
        username,
        password
    })

    await newUser.save();

    res.status(201).json({message : 'Signed up successfully' , token : jwtToken});

});

app.post('/login' , async  (req , res ) => {
    let {username , password} = req.body;

    let logginUser = await user.findOne({username})

    if (!logginUser) { 
        res.status(403).json({message : "username doesn't exist" })
        return;
    }

    console.log(logginUser)

    if (logginUser.password !== password) {
        res.status(403).json({message : 'invalid password'})
        return;
    }

    let jwtToken = jwt.sign({username} , secretKeyUser , {expiresIn : '1hr'});

    res.status(200).json({message : 'Successfully logged in' , token : jwtToken})
    
})

// add is login authentication 
// create meeting room
app.post('/create-meeting' , (req , res ) => { 
    let roomId = Math.ceil(Math.random() * 10000 )

    res.status(201).json({message : 'Created meeting room' , id : roomId})
})

// joining meeting room
app.post('/existing-meeting' , (req , res ) => { 
    
})
app.listen(3000 , () => { 
    console.log('started listening on port 3000')
})