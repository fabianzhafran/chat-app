// Set up libraries
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io') // Bilateral connection
const unirest = require('unirest') 
const badWords = require('bad-words') // Filter bad words
const msgFuncs = require('./utils/messages') // Create message objects
const {addUsers, removeUser, getUser, getUsersInRoom} = require('./utils/users') // Handling users

// Web server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Setup port location
const port = process.env.PORT || 3000

// Define paths for express
const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath))


let welcomeMsg = 'Welcome!'

// On connection
io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    // Send message to the chat
    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new badWords()
        if (!filter.isProfane(msg)) {
            io.to(user.roomname).emit('messageContent', msgFuncs.generateMessage(user.username, msg))
            callback(undefined, 'Delivered!') // bad message undefined, set acknowledgement to 'Delivered!'
        } else {
            const badWordMsg = 'Using bad words are prohibited here. Please rethink your use of words.'
            callback(msgFuncs.generateMessage(user.username, badWordMsg), 'Delivered') // bad message detected, but still delivered anyway.
        }
    })

    // Sending Location
    socket.on('sendLocation', (loc, callback) => {
        const user = getUser(socket.id)
        io.to(user.roomname).emit('locationContent', msgFuncs.generateMessage(user.username, loc))
        callback(undefined, 'Location Delivered!')
    })

    // Join page
    socket.on('join', ({username, roomname}, callback) => {
        const {error, user} = addUsers({ id : socket.id, username, roomname})
        if (error) {
            return callback(error)
        }
        // console.log(users)

        socket.join(user.roomname)
        socket.emit('messageContent', msgFuncs.generateMessage('Admin', welcomeMsg)) // Send to current connected user only
        socket.broadcast.to(user.roomname).emit('messageContent', msgFuncs.generateMessage(`~~~${user.username} has joined the chat~~~`)) // Broadcast to everyone except the new dude
        // Render the sidebar room name
        io.to(user.roomname).emit('roomData', {
            room : user.roomname,
            users : getUsersInRoom(user.roomname)
        })

        callback()
    })

    // When a user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log(`${user.username} has left the site`)
        if (user) {
            io.to(user.room).emit('messageContent', msgFuncs.generateMessage('~~~A user has left~~~'))
            io.to(user.room).emit('roomData', {
                room : user.roomname,
                users : getUsersInRoom(user.roomname) 
            })
        }
    })
})

app.get('', (req, res) => {
    res.render('index')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port + '...')
})





