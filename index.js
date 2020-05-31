var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)
var _ = require('lodash')
var util = require('./util')
app.use(express.static(__dirname + '/dist'));

// app.get('/', (req, res)=> {
//     console.log("ssdassad "+__dirname)
//     res.sendFile(__dirname + '/dist/index');
// })

gameContext = {
    mapSize: {height:32*30, width:32*30},
    blockSize: 32,
}
io.on('connection', (socket)=>{
    console.log("\nA user connected")
    socket.on('message', function (message) {
        console.log(message);
      });
    socket.on('get-map', (userid)=>{
        console.log("get-map ", userid)
        blocks = util.generateMap(gameContext.mapSize, gameContext.blockSize)
        socket.emit('get-map',{blocks:blocks})
    })
    socket.on('user-input', (input)=>{
        console.log(input)
        gameContext[socket.name] = util.handleInput(input.keys, gameContext[socket.name])
        io.sockets.emit('position',{[socket.name]:gameContext[socket.name]})
    })
    socket.on('disconnect', ()=> {
        console.log("\nA user disconnected")
        delete gameContext[socket.name]
    })
    socket.on('create-id', (name)=>{
        console.log("name",name)
        console.log("gameContext",gameContext)
        if(name in gameContext){
            socket.emit('name-taken',name)
        } else {
            socket.name = name
            gameContext[name] = {
                posx: 100,
                posy: 50,
                color: _.sample(["red", "green", "blue"])
            }
            console.log("newGameContext",gameContext)
            io.sockets.emit('game-context',gameContext)
        }
    })
})

server.listen(3001, ()=> {
    console.log("STARTED LISTENING")
})
