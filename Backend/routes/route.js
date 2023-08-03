import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import { auth } from '../middleware/auth';
import jwt from 'jsonwebtoken'
import { user, Meeting } from './db/schema_model';
require('dotenv').config();

const app = express()
const secretKeyUser = process.env.SECRETKEY

app.use(bodyParser.json())
app.use(cors())

const router = express.Router()

router.post('/signup' , async (req , res) => { 
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

router.post('/login' , async  (req , res ) => {
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

router.post('/auth' , auth , (req , res) => { 
    res.status(200).json({message: 'successfully logged in.'})
})

// create meeting room
router.post('/create-meeting' , auth , (req , res ) => { 
    let roomId = Math.ceil(Math.random() * 10000 )

    res.status(201).json({message : 'Created meeting room' , id : roomId})
})

// joining meeting room
router.get('/existing-meeting' , auth , (req , res ) => { 
    
})


module.exports = router