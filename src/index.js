import io from 'socket.io-client';
import Game from './game/game'
var game = null
window.onload = () => {

    var socket = io({
        transports: ['websocket']
    });
    var userid = "vikram"+Math.floor(Math.random()*100)
    socket.on('reconnect_attempt', () => {

        console.log("Reconnecting...")
        socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('connect', () => {

        socket.emit('create-id', userid)
    })
    socket.on('game-context', (gameContext) => {
        console.log("gameContext ",gameContext, game)
        if (game === null) {
            console.log("GAME IS UNDEFINED:", gameContext)
            game = new Game(socket = socket, userid = userid, gameContext = gameContext)
            game.init()
            window.requestAnimationFrame(()=>game.loop())
        } else {
            console.log("GAME IS DEFINED:", gameContext)
            game.gameContext = gameContext
        }

    })
    console.log("Started..")

}    
