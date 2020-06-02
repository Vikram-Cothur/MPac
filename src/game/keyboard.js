import _ from 'lodash'
export default class Keyboard {
    constructor (socket) {
        this.keysPressed = []
        this.keyMask = ["w","a","s","d"]
        this.socket = socket
        
        if (window.onkeydown){
            window.onkeydown = null
        }
        if (window.onkeyup){
            window.onkeyup = null
        }
        window.onkeydown= (ev)=>this.pressDown(ev)
        window.onkeyup = (ev)=>this.pressUp(ev)
        
        this.interval = setInterval(()=>{
            if(this.keysPressed.length != 0 ){
                this.socket.handleInput({ keys: this.keysPressed })

            }
        }, 50)
    }
    pressDown(ev) {
        //console.log(this.keysPressed)
        // if (this.keyMask.includes(ev.key)) {
        //     if(!this.keysPressed.includes(ev.key)){
        //         this.keysPressed = _.concat(this.keysPressed, ev.key)
        //     }
        //     console.log(this.keysPressed)
        //     this.socket.handleInput({ keys: this.keysPressed })
        // }
        if (this.keyMask.includes(ev.key)) {
            if(this.keysPressed.includes(ev.key)){
                return
            }
            this.keysPressed = _.concat(this.keysPressed, ev.key)
            console.log(this.keysPressed)
        }
    }
    pressUp(ev) {
        if (this.keyMask.includes(ev.key)) {
            _.pull(this.keysPressed, ev.key);
        }
    }
}