var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)
var _ = require('lodash')
var util = require('./util')
app.use(express.static(__dirname + '/dist'));


gameContext = {
    mapSize: { height: 32 * 30, width: 32 * 50 },
    blockSize: 32,
}

const blocks = util.generateMap(gameContext.mapSize, gameContext.blockSize)

io.on('connection', (socket) => {

    console.log("\nA user connected")
    socket.on('message', function (message) {
        console.log(message);
    });
    socket.on('get-map', (userid) => {
        console.log("get-map ", userid)
        socket.emit('get-map', { blocks: blocks })
    })
    socket.on('user-input', (input) => {
        if (typeof socket.name === "undefined") {
            socket.emit("error", "Player is not recognized")
            return
        }
       
        gameContext[socket.name] = util.handleInput(input.keys, gameContext[socket.name], blocks, gameContext.blockSize)
        io.sockets.emit('position', { [socket.name]: gameContext[socket.name] })
    })

    socket.on('user-input-joystick', input => {
        if (typeof socket.name === "undefined") {
            socket.emit("error", "Player is not recognized")
            return
        }
        // console.log(input, gameContext[socket.name])
        gameContext[socket.name] = util.handleInputJoystick(input.vector, gameContext[socket.name])
        io.sockets.emit('position', { [socket.name]: gameContext[socket.name] })
    })
    socket.on('disconnect', () => {
        console.log("\nA user disconnected")
        delete gameContext[socket.name]
    })
    socket.on('create-id', (name) => {
        console.log("name", name)
        console.log("gameContext", gameContext)
        if (name in gameContext) {
            socket.emit('name-taken', name)
        } else {
            socket.name = name
            gameContext[name] = {
                posx: 100,
                posy: 50,
                color: _.sample(["red", "green", "blue"])
            }
            console.log("newGameContext", gameContext)
            io.sockets.emit('game-context', gameContext)
        }
    })
    socket.on('game-context', (userid) => {
        if (userid in gameContext) {

            console.log("USER ID PRESENT", gameContext)
            socket.emit('game-context', gameContext)
        } else {
            // if user id not present add it
            console.log("USER ID NOT PRESENT", gameContext)
            socket.name = userid
            gameContext[userid] = {
                posx: 100,
                posy: 50,
                color: _.sample(["red", "green", "blue"])
            }
            socket.emit('game-context', gameContext)
        }
    })
})

server.listen(3001, () => {
    console.log("STARTED LISTENING")
})
