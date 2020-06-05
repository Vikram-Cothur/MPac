export default class Player {
    constructor(gameContext, name, playerObj, isUser) {
        this.name = name
        this.playerObj = playerObj
        this.gameContext = gameContext
        this.isUser = isUser
        this.blockSize = gameContext.get().blockSize
        this.speed = 14
        this.angleA = Math.random() * 360                            // start angle (for HSL)
        this.angleB = Math.random() * 360
        this.stepA = 1.2*1.5
        this.stepB = 0.7*1.5;
    }
    draw(ctx) {

        const v = this.gameContext.get().users[this.name]
        const o = this.gameContext.getOld().users[this.name] || v


        let posx = v.posx
        let posy = v.posy
        if (v.posx - o.posx > this.speed) {
            posx = o.posx + this.speed
        }
        if (v.posy - o.posy > this.speed) {
            posy = o.posy + this.speed
        }

        ctx.textAlign = "center";
        ctx.font = "16px Arial";
        if (v.special) {
            ctx.fillStyle = this.createGradient(ctx)
        }else {
            ctx.fillStyle = v.color;
        }
        ctx.fillText(this.name, posx + (this.blockSize / 2), posy - 5)
        ctx.fillRect(posx, posy, this.blockSize, this.blockSize);
        ctx.fillStyle = "white";
        ctx.fillText(v.score, posx + (this.blockSize / 2), posy + 20)
        //just Eaten animation
        if (v.justEaten > 0) {
            const eaten = v.justEaten
            console.log(v.justEaten)
            ctx.lineWidth = 5
            for (var i = 0; i < eaten; i++) {
                // ctx.strokeStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                //rgb(128,0,128)
                const color = 800080
                ctx.strokeStyle = "#" + (color - (i))
                ctx.strokeRect(posx - i, posy - i, this.blockSize + (i * 2), this.blockSize + (i * 2))
            }

        }
        if (v.justEatenPlayer.num > 0) {
            const eaten = v.justEatenPlayer.num
            console.log(v.justEatenPlayer)
            ctx.lineWidth = 5
            for (var i = 0; i < eaten; i++) {
                // ctx.strokeStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                //rgb(128,0,128)
                const color = v.justEatenPlayer.color
                ctx.strokeStyle = color
                ctx.strokeRect(posx - i, posy - i, this.blockSize + (i * 2), this.blockSize + (i * 2))
            }

        }
      
        if (this.isUser) {
            this.scrollWindowCenter(v)
        }

    }
    scrollWindowCenter(cur) {
        var centerx = window.innerWidth / 2
        var centery = window.innerHeight / 2
        if (cur.posx - centerx < 0 && cur.posy - centery < 0)
            return

        let posx = cur.posx - centerx
        let posy = cur.posy - centery
        // setTimeout(window.scrollTo(posx,posx),100);
        window.scrollTo(posx, posy)
    }
    createGradient(ctx) { //direct from so
        var gr = ctx.createLinearGradient(0, 0, 500, 0);               // create gradient
        gr.addColorStop(0, "hsl(" + (this.angleA % 360) + ",100%, 50%)");   // start color
        gr.addColorStop(1, "hsl(" + (this.angleB % 360) + ",100%, 50%)");   // end color

        this.angleA += this.stepA;                                               // increase angles
        this.angleB += this.stepB;
        return gr;                                            // set as fill style
    }
}