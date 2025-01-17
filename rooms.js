#! /usr/bin/node
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)
var _ = require('lodash')
var util = require('./util')
app.use(express.static(__dirname + '/dist'));
var roomno = 1

rooms = {
    room1:{
        gameContext : {
            mapSize: { height: util.consts.blockSize * (40 + util.consts.outterBlocks), width: util.consts.blockSize * (70 + util.consts.outterBlocks) },
            blockSize: util.consts.blockSize,
            foodSize: util.consts.foodSize,
            users: {},
            userBlocks: []
        }
        
    }
}


const startCycle = (room, rooms) => {
    const gameContext = rooms
    const blocks = util.generateMap(gameContext.mapSize, gameContext.blockSize)
    const food = util.generateFood(null, gameContext.mapSize, blocks, gameContext.blockSize)
    gameCycle = setInterval(() => {
        io.sockets.in(room).emit('game-context', gameContext);
    }, 20);
    foodCycle = setInterval(() => {
        gameContext.food = util.generateFood(food, gameContext.mapSize, blocks, gameContext.blockSize)
    }, 1000)
    playerEatCycle = setInterval(() => {
        util.handlePlayerEatPlayer(gameContext)
    }, 100)
}
io.on('connection', (socket) => {

    if(io.nsps["/"].adapter.rooms[`room-${roomno}`] &&
     io.nsps['/'].adapter.rooms[`room-${roomno}`].length>1){
         roomno+=1
     }
     socket.join(`room-${roomno}`)
     console.log(socket.rooms)
    console.log("\nA user connected")
    socket.on('message', function (message) {
        console.log(message);
    });
    socket.on('get-map', (userid) => {
        console.log("get-map ", userid)
        socket.emit('get-map', { blocks: blocks })
    })
    socket.on('user-input', (input) => {
        if (typeof socket.name === "undefined" || gameContext.users[socket.name] === "undefined") {
            socket.emit("error", "Player is not recognized")
            return
        }

        // console.log(input, socket.name)
        util.handleInput(input.keys, blocks, gameContext, socket.name)
        
        //io.sockets.emit('position', { [socket.name]: gameContext[socket.name] })
    })

    socket.on('user-input-joystick', input => {
        if (typeof socket.name === "undefined") {
            // socket.emit("error", "Player is not recognized")
            return
        }
        // console.log(input, gameContext[socket.name])
        gameContext.users[socket.name] = util.handleInputJoystick(input.vector, gameContext.users[socket.name])
        io.sockets.emit('position', { [socket.name]: gameContext.users[socket.name] })
    })
    socket.on('disconnect', () => {
        console.log("\nA user disconnected")
        delete gameContext.users[socket.name]
    })
    socket.on('create-id', ({ name, color }) => {
        console.log("name", name)
        console.log("color", color)
        console.log("gameContext", gameContext)
        if (name in gameContext.users) {
            socket.emit('name-taken', name)
        } else {
            socket.name = name
            util.initUser(name, color, gameContext)
            console.log("newGameContext", gameContext)
            socket.emit("refresh", { reason: "player added" })
            // io.sockets.emit('game-context', gameContext)
        }
    })
    socket.on('game-context', (user) => {
        const userid = user.name
        const color = user.color

        if (userid in gameContext) {

            console.log("USER ID PRESENT", gameContext)
            socket.emit('error', "User is already present")
        } else {
            // if user id not present add it
            console.log("USER ID NOT PRESENT", gameContext)
            socket.name = userid
            util.initUser(userid, color, gameContext)
            // socket.emit('game-context', gameContext)

        }
    })
    socket.on('user-click-input', input => {
        if (gameContext.users[socket.name].blocks <= 0) {
            return
        }
        input.pos[0] = Math.floor(input.pos[0])
        input.pos[1] = Math.floor(input.pos[1])
        const s = gameContext.blockSize
        for (var block of gameContext.userBlocks) {
            if ((block[0] + s) >= input.pos[0]
                && block[0] <= input.pos[0]
                && (block[1] + s) >= input.pos[1]
                && block[1] <= input.pos[1]) {
                return
            }
        }
        input.pos[0] -= Math.floor(s / 2)
        input.pos[1] -= Math.floor(s / 2)
        gameContext.userBlocks.push(input.pos)
        util.vanishAfter(5, gameContext, input.pos)
        gameContext.users[socket.name].blocks -= 1
    })
    socket.on('error', (error) => {
        console.log(error)
    })
})
// var env = process.env.NODE_ENV || 'development';
server.listen(3001, () => {
    console.log("STARTED LISTENING")
})