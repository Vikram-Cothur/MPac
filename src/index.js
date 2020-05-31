import io from 'socket.io-client';
import Game from './game/game'
import nipplejs from 'nipplejs'
var game = null
window.onload = () => {
    var userid = sessionStorage.getItem("userid")


    var socket = io({
        transports: ['websocket']
    });

    socket.on('reconnect_attempt', () => {

        console.log("Reconnecting...")
        socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('connect', () => {
        if (!userid) {
            userid = "vikram" + Math.floor(Math.random() * 100)
            const form = document.querySelector("#form")
            form.className = "active"
            const btn = document.querySelector("#submit")
            const onsubmit = ()=>{
                const userid = document.querySelector("#userid").value
                socket.emit('create-id', userid)
                sessionStorage.setItem("userid", userid)
                form.className = "inactive"
            }
            btn.addEventListener('click',onsubmit)
        } else {
            socket.emit('game-context', userid)
        }
    })
    socket.on('name-taken', name => {
        sessionStorage.removeItem("userid")
        alert("NAME TAKEN")
        window.location.reload()
    })
    socket.on('game-context', gameContext => {
        console.log("gameContext ", gameContext, game)
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // user is using mobile!
            console.log(navigator.userAgent)
            var nipple = nipplejs.create({
                zone: document.getElementById('zone_joystick'),
                mode: 'static',
                position: { left: '80%', top: '80%' },
                color: 'red'
            });
            alert("There are currently some issues in the mobile version. Please open with a pc")
        }
        if (game === null) {
            console.log("GAME IS UNDEFINED:", gameContext)
            game = new Game(socket = socket, userid = userid, gameContext = gameContext, nipple)
            game.init()
            window.requestAnimationFrame(() => game.loop())
        } else {
            console.log("GAME IS DEFINED:", gameContext)
            game.gameContext = gameContext
        }

    })

    

    console.log("Started..")

}    
