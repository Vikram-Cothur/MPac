class Socket {
    constructor(socket, userid, gameObj){
        this.socket = socket
        this.userid = userid
        this.gameObj = gameObj
        this.socket.on('position', (postition)=>this.handlePosition(postition))
    }
    handleInput(inputs){
        this.emit('user-input',inputs)
    }
    handlePosition(position){
        this.gameObj.handlePosition(position)
    }
    emit(event, msg){
        if(typeof msg === "undefined"){
            msg = {userid:this.userid}
        }
        if (typeof msg === "string"){
            msg = {msg:msg, userid:this.userid}
        }
        if(typeof msg === "object") {
            msg = {...msg, userid:this.userid}
        }
        
        this.socket.emit(event, msg)
        
    }
    getMap(func){
        this.emit('get-map')
        this.socket.on('get-map', func)
    }
}
export default Socket