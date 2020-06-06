export default class Map {
    constructor(socket, gameContext){
        this.ready = false
        console.log("MAP")
        this.socket = socket
        this.gameContext = gameContext
        this.blockSize = gameContext.get().blockSize
        socket.getMap((map)=>this.getMap(map))
    }
    getMap(map){
        // console.log("MAP -> ",map)
        this.blocks = map.blocks
        this.ready = true
    }
    drawMap(ctx){
        ctx.fillStyle = "black";
        this.blocks.forEach(block => {
            ctx.fillRect(block[0], block[1], this.blockSize, this.blockSize );
        });
        this.gameContext.get().userBlocks.forEach(block => {
            ctx.fillRect(block[0], block[1], this.blockSize, this.blockSize );
        })
    }
    
}