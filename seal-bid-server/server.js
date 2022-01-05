const express = require('express')
const app = express()



const server = require('http').Server(app)
    .listen(3000,()=>{console.log('open server!')})

// Add Access-header-no-contorol to prevent cros
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

io.on('connection', socket => {

    socket.on('commitment', message => {
        // Return message to all listener
        io.sockets.emit('commitment', message)
    })

    socket.on('round1', message => {
        
        io.sockets.emit('round1', message)
    })

    socket.on('round2', message => {
        
        io.sockets.emit('round2', message)
    })

    socket.on('final', message => {
        
        io.sockets.emit('final', message)
    })

   
})