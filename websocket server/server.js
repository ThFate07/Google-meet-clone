const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')

const io = new Server(server , { 
    cors: {
        origin: 'http://localhost:5173'
    }
})

io.on('connection' , (socket) => { 
    console.log('user joined')

    socket.on('joined' ,() => { 
        socket.broadcast.emit('joined')
    })
    
    socket.on('disconnect' , () => { 
        console.log('socket disconnected')
    })

    socket.on('sdp-offer' , (offer) => { 
        socket.broadcast.emit('sdp-offer' , offer)
    })

    socket.on('sdp-answer' , (answer) => { 
        socket.broadcast.emit('sdp-answer' , answer)
    })

})

io.listen(4000)