export default class Mouse {
    constructor(socket, gameContext, userid) {
        this.socket = socket
        this.latency = 50
        this.pressed = false
        this.oldPos = [0, 0]
        this.pos = [0, 0]
        this.gameContext = gameContext
        this.userid = userid
        if (document.getElementById("the-mother").onmousedown) {
            document.getElementById("the-mother").onmousedown = null
        }
        if (document.getElementById("the-mother").onmouseup) {
            document.getElementById("the-mother").onmouseup = null
        }
        if (document.getElementById("the-mother").onmousemove) {
            document.getElementById("the-mother").onmousemove = null
        }
        document.getElementById("the-mother").onmousedown = (ev) => this.pressDown(ev)
        document.getElementById("the-mother").onmouseup = (ev) => this.pressUp(ev)
        document.getElementById("the-mother").onmousemove = (ev) => this.mouseMove(ev)

        this.interval = setInterval(() => {
            if (this.pressed && (this.pos[0] !== this.oldPos[0] && this.pos[1] !== this.oldPos[1])) {
                this.socket.handlePressInput({ pos: this.pos })

            }
        }, this.latency)
    }
    pressDown(ev) {
        console.log("pressed: ", this.gameContext.get().users[this.userid].blocks, ev.offsetX, ev.offsetY)
        if(this.gameContext.get().users[this.userid].blocks<=0){
            return
        }
        this.oldPos[0] = this.pos[0]
        this.oldPos[1] = this.pos[1]
        this.pos[0] = ev.offsetX
        this.pos[1] = ev.offsetY
        console.log(ev.offsetX, ev.offsetY)
        this.pressed = true
    }

    pressUp(ev) {
        this.pressed = false
    }
    mouseMove(ev) {
        if(!this.pressed){
            return
        }
        console.log("move: ", this.gameContext.get().users[this.userid].blocks, ev.offsetX, ev.offsetY)
        if(this.gameContext.get().users[this.userid].blocks<=0){
            return
        }
        this.oldPos[0] = this.pos[0]
        this.oldPos[1] = this.pos[1]
        this.pos[0] = ev.offsetX
        this.pos[1] = ev.offsetY
        console.log(ev.offsetX, ev.offsetY)
    }
}