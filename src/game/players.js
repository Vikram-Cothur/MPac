export default class Players {
    constructor(ctx, userid){
        this.ctx = ctx
        this.userid = userid
        console.log("player ctx",ctx)
    }
    
    draw(gameContext){
        _.each(gameContext, (v, k) => {
            if(k===this.userid){
                this.scrollWindowCenter(v)
            }
            this.ctx.textAlign = "center";
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = v.color;
            this.ctx.fillText(k, v.posx+(gameContext.blockSize/2), v.posy-5)
            this.ctx.fillRect(v.posx, v.posy, gameContext.blockSize, gameContext.blockSize);
            this.ctx.fillStyle = "white";
            this.ctx.fillText(v.score, v.posx+(gameContext.blockSize/2), v.posy+20)
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