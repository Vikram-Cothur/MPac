import Socket from '../socket/socket'
import Joystick from './joystick'
import Keyboard from './keyboard'
import Map from './map'
import _ from 'lodash'
import PlayerGroup from './playergroup'
import Food from './food'
import Mouse from './mouse'

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
        this.mouse = new Mouse(this.socket, this.gameContext, this.userid)
        console.log(this.gameContext)
        this.canvas.width = this.gameContext.get().mapSize.width
        this.canvas.height = this.gameContext.get().mapSize.height
        this.Map = new Map(this.socket, this.gameContext)
        this.players = new PlayerGroup(this.ctx, this.gameContext, this.userid)
        this.food = new Food(this.ctx)
        console.log("Socket ", socket)
        console.log("Game Context",gameContext)
    }
    init() {
        var ctx = this.ctx
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.stroke();        
    }
    loop() {
        var ctx = this.ctx
        if(this.Map.ready){
            ctx.fillStyle ="white";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.food.draw(this.gameContext)
            this.Map.drawMap(ctx)
            this.players.draw()
            
        }
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
