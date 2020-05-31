import Socket from '../socket/socket'
import Joystick from './joystick'
import Keyboard from './keyboard'
import Map from './map'
import _ from 'lodash'

export default class Game {
    constructor(socket, userid, gameContext, joystick) {
        this.canvas = document.querySelector("#the-mother")
        this.ctx = this.canvas.getContext("2d")
        this.userid = userid
        this.socket = new Socket(socket, userid, this)
        this.gameContext = gameContext
        if(typeof joystick !== "undefined")
            this.controller = new Joystick(joystick, this.socket)
        else 
            this.controller = new Keyboard(this.socket)
        this.canvas.width = this.gameContext.mapSize.width
        this.canvas.height = this.gameContext.mapSize.height
        this.Map = new Map(this.socket, this.gameContext)
        
        console.log("Socket ", socket)
    }
    init() {
        var ctx = this.ctx
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.stroke();
        this.background = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        this.background.addColorStop(0, "red");
        this.background.addColorStop(0.1, "white");
        this.background.addColorStop(0.2, "black");
        this.background.addColorStop(0.3, "green");
        this.background.addColorStop(0.4, "purple");
        this.background.addColorStop(1, "white");

        
    }
    loop() {
        var ctx = this.ctx
        if(this.Map.ready){
            ctx.fillStyle ="white";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.Map.drawMap(ctx)
        }
        _.each(this.gameContext, (v, k) => {
            ctx.fillStyle = v.color;
            ctx.fillText(k, v.posx, v.posy-5)
            ctx.fillRect(v.posx, v.posy, this.Map.blockSize, this.Map.blockSize);
        })
        window.requestAnimationFrame(() => this.loop())
    }
    // handleInput(e) {
    //     if (consts.keyMask.includes(e.key)) {
    //         this.socket.handleInput({ key: e.key })
    //     }
    // }
    handlePosition(e) {
        _.each(e, (v, k) => {
            if (k === this.userid) {
                console.log("e",e, window.innerWidth)
                this.scrollWindowCenter(v)
            }
            this.gameContext[k] = v
        })

    }
    scrollWindowCenter(cur) {
        var centerx = window.innerWidth/2
        var centery = window.innerHeight/2
        if(cur.posx - centerx < 0 && cur.posy - centery < 0) 
            return

        let posx = cur.posx - centerx
        let posy = cur.posy - centery
        // setTimeout(window.scrollTo(posx,posx),100);
        window.scrollTo(posx, posy)
    }
}
