import io from 'socket.io-client';
import _ from 'lodash';
import Game from './game/game'
import Mother from './game/mother'
import nipplejs from 'nipplejs'
var mother = null
window.onload = () => {
    const players = document.getElementsByClassName("player")
    const team1 = document.getElementById("team1")
    const team2 = document.getElementById("team2")


    const params = new URLSearchParams(window.location.search)
    let username = null
    let color = null
    let roomCode = params.toString().length === 0 ? null : params.get("roomCode")
    console.log("initial roomCode => " + roomCode)
    let isAdmin = params.toString().length === 0

    if (isAdmin) {
        document.getElementById("play").onclick = (ev) => {
            const settings = {}
            settings.mapSize = document.getElementById("mapsize").value
            settings.totalFood = document.getElementById("food").value
            settings.timeLimit = document.getElementById("time").value
            socket.emit("play", settings)

        }
    } else {
        document.getElementById("time").disabled = true
        document.getElementById("team1color").disabled = true
        document.getElementById("team2color").disabled = true
        document.getElementById("mapsize").disabled = true
        document.getElementById("food").disabled = true
    }
    console.log(isAdmin)
    const askNameModal = document.getElementById("ask-name-modal")
    askNameModal.style.display = "flex"
    const useName = document.getElementById("use-name")
    useName.onclick = (ev) => {
        const name = document.getElementById("username").value
        if (name === "") {
            alert("Please provide a name" + name)
            return
        }
        username = name
        if (!socket) alert("Could not connect to the server please try again later.")
        color = team1.style.backgroundColor
        socket.emit("set-player", username, color, "team1")
        console.log(team1.style.backgroundColor)

        const player = createPlayer(username, playerClicked)

        team1.append(player)


        askNameModal.style.display = "none"

    }
    const showTips = (tip, whereId) => {
        const tipsElem = document.getElementById('tips')
        tipsElem.innerHTML = `<span class="tip">${tip}</span>
            <span id="close-button" class="close-button">&times;</span>`
        tipsElem.style.display = "inline-flex"
        document.getElementById(whereId).after(tipsElem)
        setTimeout(() => {
            tipsElem.style.display = "none"
        }, 2000)
        document.getElementById("close-button").addEventListener("click", (ev) => { tipsElem.style.display = "none" })
    }

    function changeTeam() {
        console.log("asdas")
    }
    for (let i = 0; i < players.length; i++) {
        players.item(i).onclick = (e) => {
            const player = e.target
            console.log(player.innerHTML)
            const currentTeam = player.parentElement.id
            console.log(currentTeam)
            if (currentTeam === "team1") {

                team2.append(player)
                // team1.removeChild(player)
            } else {
                team1.append(player)
                // team2.removeChild(player)
            }
        }
    }
    const selectColorTeam1 = document.getElementById("team1color")
    const selectColorTeam2 = document.getElementById("team2color")

    selectColorTeam1.onchange = (e) => {
        team1.style.backgroundColor = selectColorTeam1.value
        if (selectColorTeam1.value === "black") {
            team1.style.border = "4px solid purple"
        } else {
            team1.style.border = ""
        }
    }
    selectColorTeam2.onchange = (e) => {
        team2.style.backgroundColor = selectColorTeam2.value
        if (selectColorTeam2.value === "black") {
            team2.style.border = "4px solid purple"
        } else {
            team2.style.border = ""
        }
    }
    team1.style.backgroundColor = selectColorTeam1.value
    team2.style.backgroundColor = selectColorTeam2.value

    function copyRoomCodeToClipboard() {
        /* Get the text field */
        var copyText = document.getElementById("myInput");
        var textArea = document.createElement("textarea")
        document.body.appendChild(textArea)
        const link = `${window.location.href}?roomCode=${roomCode}`
        textArea.value = link

        /* Select the text field */
        textArea.select();
        textArea.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        textArea.remove()
    }
    //attaching event handlers
    document.getElementById("copy-link").onclick = (ev) => { copyRoomCodeToClipboard(); showTips('Copied!', 'copy-link'); }


    //functions to be attached while creating elements
    const createPlayer = (name, onClick) => {
        const player = document.createElement("div")
        player.className = "player"
        player.innerText = name

        player.onclick = onClick
        return player
    }
    const playerClicked = (e) => {
        const team1 = document.getElementById("team1")
        const team2 = document.getElementById("team2")
        const player = e.target
        console.log(player.innerHTML)
        const currentTeam = player.parentElement.id
        console.log(currentTeam)
        if (currentTeam === "team1") {
            const name = player.innerText
            const color = team2.style.backgroundColor
            const team = "team2"
            socket.emit("set-player", name, color, team)
            team2.append(player)
            // team1.removeChild(player)
        } else {
            const color = team1.style.backgroundColor
            const name = player.innerText
            const team = "team1"
            socket.emit("set-player", name, color, team)
            team1.append(player)
            // team2.removeChild(player)
        }
    }




    //socket defs

    var socket = io("/room", {
        transports: ['websocket']
    })

    socket.on("connect", () => {
        console.log("connected to socket server")
        if (isAdmin) {
            console.log("admin creating room")
            socket.emit("create-room-code")
        } else {
            socket.emit("room-code", roomCode)
        }
    })
    socket.on("room-code", (room) => {
        roomCode = room
        console.log("roomCode => " + roomCode)
    })
    socket.on("disconnect", () => {
        console.log("disconnected")
    })
    socket.on("players", (players) => {
        console.log("players -> ", players)
        //removing every thing from team1 and team2
        var child = team1.lastElementChild;
        while (child) {
            team1.removeChild(child);
            child = team1.lastElementChild;
        }
        child = team2.lastElementChild;
        while (child) {
            team2.removeChild(child);
            child = team2.lastElementChild;
        }

        //adding in all the players
        Object.keys(players).forEach((p, i) => {
            console.log(players[p].team)
            const team = document.getElementById(players[p].team)

            if (p === username || isAdmin)
                team.append(createPlayer(p, playerClicked))
            else
                team.append(createPlayer(p, null))

        })
        // const player = createPlayer(username, playerClicked)

    })



    socket.on('game-context', gameContext => {
        // console.log("gameContext ", gameContext)
        sessionStorage.setItem("userid", username)
        sessionStorage.setItem("color", color)
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

            //remove all children of body
            var child = document.body.lastElementChild;
            while (child) {
                document.body.removeChild(child);
                child = document.body.lastElementChild;
            }
            // create canvas and append to body
            const theMotherCanvas = document.createElement("canvas")
            theMotherCanvas.id = "the-mother"
            document.body.append(theMotherCanvas)

            //create leaderboard and append to body
            const leaderboard = document.createElement("div")
            leaderboard.id = "leaderboard"
            leaderboard.className = "leaderboard"
            leaderboard.innerHTML =
                `<div id="seconds"> </div>
                
                <div id="players"> <div>`
            document.body.append(leaderboard)
            const seconds = document.getElementById("seconds")
            seconds.style = 
                `border-bottom: 2px solid;
                width: 100%;
                text-align: center;`
            const players = document.getElementById("players")
            Object.keys(gameContext.users).forEach((v, i) => {
                const player = document.createElement("div")
                player.style = 
                    `display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    width: 100%;
                    height: auto;`
                player.id = v
                player.innerHTML = `${v} ${gameContext.users[v].score}`
                players.append(player)
            })
            mother = new Mother(socket, username, gameContext, nipple)
            window.scrollTo(500, 350)
            console.log(mother)

            //gameover  timeout
            setTimeout(()=>{
                leaderboard.classList.add("leaderboard-gameover")
                theMotherCanvas.style = `filter: blur(1px);`
            },gameContext.endTime-gameContext.startTime) 


            setInterval(() => {
                Object.keys(gameContext.users).forEach((v, i) => {
                    document.getElementById(v).innerHTML = `${v} ${mother.get().users[v].score}`
                })

                seconds.innerHTML = `<div>${Math.floor(mother.get().now / 1000)} seconds</div>`
            }, 1000)
        } else {
            //console.log("GAME IS DEFINED:", gameContext)
            mother.update(gameContext)
        }

    })
}