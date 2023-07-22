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

const rooms = [];

function findRoom(roomId) { 
    return rooms.find(room => room.roomId === roomId)
}

io.on('connection' , (socket) => { 
    console.log('user joined')

    socket.on('joined' ,(roomId) => {
        const isRoom = findRoom(roomId)

        if (!isRoom) { 
            rooms.push({
                roomId,
                users : [socket.id]
            }) 
            return;
        }

      
        isRoom.users = [...isRoom.users , socket.id]

        if (isRoom.users.length <= 2) { 
            
            socket.broadcast.to(isRoom.users[0]).emit('joined');
        } else { 
            console.log("couldn't esatablish connection as users in room exceed 2")
        }

        
    })
    
    socket.on('disconnect' , () => { 
        console.log('socket disconnected')
    })

    socket.on('sdp-offer' , (offer , roomId) => {
        const room = findRoom(roomId)
        const userToSend = room.users[1]

        socket.broadcast.to(userToSend).emit('sdp-offer' , offer)
    })

    socket.on('sdp-answer' , (answer , roomId) => { 
        const room = findRoom(roomId)
        const userToSend = room.users[0]

        socket.broadcast.to(userToSend).emit('sdp-answer' , answer)
    })

})

io.listen(4000)