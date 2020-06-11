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
    room1: {
        blocks: [],
        gameContext: {
            mapSize: { height: util.consts.blockSize * (40 + util.consts.outterBlocks), width: util.consts.blockSize * (70 + util.consts.outterBlocks) },
            blockSize: util.consts.blockSize,
            foodSize: util.consts.foodSize,
            users: {},
            userBlocks: []
        }

    }
}

const cleanUp = (rooms, room) => {
    console.log(`Deleting all intervals on ${room} `)
    clearInterval(playerEatCycle)
    clearInterval(foodCycle)
    clearInterval(gameCycle)
    clearInterval(deleteCycles)

    console.log(`Deleting room ${room} from ${rooms}`)
    delete rooms[room]
    console.log(rooms)
}
const startCycle = (roomNameSpace, room, rooms, numOfFood, time) => {
    const runTill = typeof time === "undefined" ? null : time
    let t = 0
    if (runTill) {
        setTimeout(() => {
            cleanUp(rooms, room)
        }, 1000 * 60 * runTill)
    }
    const totalFood = typeof numOfFood === "undefined" ? 50 : numOfFood
    let gameContext;
    if(roomNameSpace === "/"){
        gameContext = util.initRoom()
        rooms[room] = {}
        rooms[room]["gameContext"] = gameContext
    } else {
        gameContext = rooms[room]["gameContext"]
    }

    const blocks = util.generateMap(gameContext.mapSize, gameContext.blockSize)
    rooms[room]["blocks"] = blocks
    
    const food = util.generateFood(null, gameContext.mapSize, blocks, gameContext.blockSize, totalFood)

    gameCycle = setInterval(() => {
        // console.log("running "+room)
        t+=20
        gameContext.time = t
        io.of(roomNameSpace).in(room).emit('game-context', gameContext);
    }, 20);
    foodCycle = setInterval(() => {
        gameContext.food = util.generateFood(food, gameContext.mapSize, blocks, gameContext.blockSize, totalFood)
    }, 1000)
    playerEatCycle = setInterval(() => {
        util.handlePlayerEatPlayer(gameContext)
    }, 100)
    deleteCycles = setInterval(() => {
        if (Object.keys(gameContext.users).length === 0) {
            cleanUp(rooms, room)

        }
    }, 1000 * 60 * 5) //5mins 1000 * 60 * 5
    
}
io.on('connection', (socket) => {
    let room = `room-${roomno}`
    if (io.nsps["/"].adapter.rooms[room] &&
        io.nsps['/'].adapter.rooms[room].length > 7) {
        roomno += 1
        room = `room-${roomno}`
    }
    if (typeof rooms[room] === "undefined") {
        //if new room was created, new cycle will be created here
        startCycle("/", room, rooms)
    }
    socket.join(room)
    const gameContext = rooms[room].gameContext
    const blocks = rooms[room].blocks
    socket.on('message', function (message) {
        console.log(message);
    });
    socket.on('get-map', (userid) => {
        console.log("get-map ", userid)
        console.log("rooms =>", socket.rooms)
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

    // socket.on('user-input-joystick', input => {
    //     if (typeof socket.name === "undefined") {
    //         // socket.emit("error", "Player is not recognized")
    //         return
    //     }
    //     // console.log(input, gameContext[socket.name])
    //     gameContext.users[socket.name] = util.handleInputJoystick(input.vector, gameContext.users[socket.name])
    //     io.sockets.emit('position', { [socket.name]: gameContext.users[socket.name] })
    // })
    socket.on('disconnect', () => {
        console.log(`\n ${socket.name} disconnected`)
        socket.leave(room);
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
            socket.color = color
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
var customRoom = io.of('/room');
customRooms = {
    room1: {
        blocks: [],
        gameContext: {
            mapSize: { height: util.consts.blockSize * (40 + util.consts.outterBlocks), width: util.consts.blockSize * (70 + util.consts.outterBlocks) },
            blockSize: util.consts.blockSize,
            foodSize: util.consts.foodSize,
            users: {},
            userBlocks: []
        }

    }
}
customRoom.on('connection', function (socket) {
    console.log('someone connected');
    socket.isAdmin = false
    let gameContext = null
    let blocks = null
    let started = null
    socket.on("create-room-code", () => {
        const a = "abcdefgijklmnopqrstuvwxyz"
        let roomCode = _.sampleSize(a, 10).join("")
        console.log("roomCode -> " + roomCode)
        while (customRooms[roomCode]) {
            roomCode = _.sampleSize(a, 10).join("")
        }
        console.log("room code assigned ", roomCode)
        customRooms[roomCode] = {}
        customRooms[roomCode].blocks = []
        customRooms[roomCode].gameContext = util.initRoom()
        customRooms[roomCode].started = false

        socket.join(roomCode)

        gameContext = customRooms[roomCode].gameContext
        blocks = customRooms[roomCode].blocks
        started = customRooms[roomCode].started
        console.log(gameContext, customRooms)
        socket.roomCode = roomCode
        socket.isAdmin = true
        socket.emit("room-code", roomCode)
    })

    socket.on("room-code", (roomCode) => {
        console.log("someone requested for room code ", customRooms[roomCode])
        console.log("available ", customRooms)
        if (typeof customRooms[roomCode] !== "undefined") {
            socket.join(roomCode)
            socket.roomCode = roomCode
            console.log(customRooms[roomCode])
            gameContext = customRooms[roomCode].gameContext
            blocks = customRooms[roomCode]["blocks"]
            started = customRooms[roomCode].started
            socket.emit("players", gameContext.users)
        }
        console.log(roomCode)
    })

    socket.on("set-player", (name, color, team) => {
        socket.name = name
        socket.color = color
        socket.team = team
        util.initUserCustomRoom(name, color, team, gameContext)
        socket.broadcast.emit("players", gameContext.users)
        // socket.emit("players", gameContext.users)
    })
    socket.on("play", ({ mapSize, totalFood, timeLimit }) => {
        console.log(mapSize, totalFood, timeLimit)
        let ratio = 1
        switch (mapSize) {
            case "mini":
                ratio = 2 / 4
                break
            case "small":
                ratio = 3 / 4
                break
            case "medium":
                ratio = 3.5 / 4
                break
            case "large":
                ratio = 4 / 4
                break
            case "thicc":
                ratio = 5 / 4
                break
            default:
                break
        }
        gameContext.mapSize = {
            height: util.consts.blockSize * ((util.consts.mapHeight * ratio) + util.consts.outterBlocks),
            width: util.consts.blockSize * ((util.consts.mapWidth * ratio) + util.consts.outterBlocks)
        }
        startCycle("/room", socket.roomCode, customRooms, totalFood, timeLimit)
    })
    socket.on("request-for-players", () => {
        console.log(gameContext)
        if (gameContext.users)
            socket.emit("players", gameContext.users)
        else
            socket.emit("players", null)
    })
    socket.on("disconnect", () => {
        console.log("a user disconnected with room code " + customRoom.roomCode)
        socket.leave(socket.roomCode)
    })

    socket.on('get-map', (userid) => {
        console.log("get-map ", userid)
        console.log("rooms =>", socket.rooms)
        
        socket.emit('get-map', { blocks: customRooms[socket.roomCode].blocks })
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
});
server.listen(3001, () => {
    console.log("STARTED LISTENING")
})