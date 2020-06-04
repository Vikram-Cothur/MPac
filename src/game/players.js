import Player from './player'
export default class Players {
    constructor(ctx, userid, gameContext){
        this.ctx = ctx
        this.userid = userid
        this.users = []
        this.gameContext = gameContext
        this.blockSize = gameContext.get().blockSize
        console.log("player ctx",ctx)
    }
    refreshPlayers(){
        this.users = []
        const users = Object.entries(this.gameContext.get().users)
        users.map((v,i)=>{
            const user = new Player(v[0], gameContext, isUser)
        })
    }
    draw(gameContext){
        _.each(gameContext, (v, k) => {
            if(k===this.userid){
                this.scrollWindowCenter(v)
            }
            
            this.ctx.textAlign = "center";
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = v.color;
            this.ctx.fillText(k, v.posx+(this.blockSize/2), v.posy-5)
            this.ctx.fillRect(v.posx, v.posy, this.blockSize, this.blockSize);
            this.ctx.fillStyle = "white";
            this.ctx.fillText(v.score, v.posx+(this.blockSize/2), v.posy+20)
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