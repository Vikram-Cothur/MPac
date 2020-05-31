import Socket from '../socket/socket'
import consts from './consts'
import Keyboard from './keyboard'
import Map from './map'
import _ from 'lodash'

export default class Game {
    constructor(socket, userid, gameContext) {
        this.canvas = document.querySelector("#the-mother")
        this.ctx = this.canvas.getContext("2d")
        this.userid = userid
        this.socket = new Socket(socket, userid, this)
        this.gameContext = gameContext
        
        this.Keyboard = new Keyboard(this.socket)
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
        console.log(e)
        _.each(e, (v, k) => {
            if (k === this.userid) {
                this.scrollWindowCenter(v)
            }
            this.gameContext[k] = v
        })
        console.log(this.gameContext)
    }
    scrollWindowCenter(cur) {
        var centerx = window.innerWidth/2
        var centery = window.innerHeight/2
        if(cur.posx - centerx < 0 && cur.posy - centery < 0) 
            return

        let posx = cur.posx - centerx
        let posy = cur.posy - centery
        window.scrollTo(posx, posy)
    }
}
