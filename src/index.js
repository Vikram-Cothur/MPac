import io from 'socket.io-client';
import Game from './game/game'
import Mother from './game/mother'
import nipplejs from 'nipplejs'
var mother = null
window.onload = () => {
    var userid = sessionStorage.getItem("userid")
    var color = sessionStorage.getItem("color")


    var socket = io({
        transports: ['websocket']
    });

    socket.on('reconnect_attempt', () => {

        console.log("Reconnecting...")
        socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('connect', () => {
        if (!userid || !color) {
            //userid = "vikram" + Math.floor(Math.random() * 100)
            const form = document.querySelector("#form")
            form.className = "active"
            const btn = document.querySelector("#submit")
            const createRoom = document.querySelector("#create-room")
            const joinRoom = document.querySelector("#join-room")
            const onsubmit = ()=>{
                const userid = document.querySelector("#userid").value
                const color = document.querySelector("#color").value
                console.log(color, document.querySelector("#color"))
                socket.emit('create-id', {name:userid, color:color})
                sessionStorage.setItem("userid", userid)
                sessionStorage.setItem("color", color)
                form.className = "inactive"
            }
            const onCreateRoom = ()=>{
                window.location.href = "/room.html"
            }
            const onJoinRoom = ()=>{
                window.location.href = "/room.html"
            }
            createRoom.addEventListener('click', onCreateRoom)
            joinRoom.addEventListener('click', onJoinRoom)
            btn.addEventListener('click',onsubmit)
        } else {
            socket.emit('game-context', {name:userid, color:color})
        }
    })
    socket.on('name-taken', name => {
        sessionStorage.removeItem("userid")
        alert("NAME TAKEN")
        window.location.reload()
    })
    socket.on('game-context', gameContext => {
        //console.log("gameContext ", gameContext, game)
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
        if (mother === null) {
            // console.log("GAME IS UNDEFINED:", gameContext)
            
            mother = new Mother(socket, userid, gameContext, nipple)
            
           console.log(mother)
        } else {
            // console.log("GAME IS DEFINED:", gameContext)
            mother.update(gameContext)
        }

    })

    socket.on('refresh', reason => {
        window.location.reload(true)
        console.log(reason)
    })

    console.log("Started..")

}    
