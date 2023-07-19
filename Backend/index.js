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

    if (logginUser.password !== password) {
        res.status(403).json({message : 'invalid password'})
        return;
    }

    let jwtToken = jwt.sign({username} , secretKeyUser , {expiresIn : '1hr'});

    res.status(200).json({message : 'Successfully logged in' , token : jwtToken})
    
})

// add is login authentication 
const authMiddleWare = (req , res , next) => {
    const token = req.headers.authorization;

    if (!token) { 
        res.status(404).json({message : 'no token provided'})
        return; 
    }

    jwt.verify(token , secretKeyUser, (error , decryptedInfo) => { 
        if (error) { 
            res.status(404).json({message : 'login expired or invalid token'})
            return;
        }

        next()
    })

}

app.post('/auth' , authMiddleWare , (req , res) => { 
    res.status(200).json({message: 'successfully logged in.'})
})

// create meeting room
app.post('/create-meeting' , authMiddleWare , (req , res ) => { 
    let roomId = Math.ceil(Math.random() * 10000 )

    res.status(201).json({message : 'Created meeting room' , id : roomId})
})

// joining meeting room
app.get('/existing-meeting' , authMiddleWare , (req , res ) => { 
    
})

app.listen(3000 , () => { 
    console.log('started listening on port 3000')
})