export default class Food {
    constructor(ctx) {
        this.ctx = ctx
        console.log("ctx", ctx)
        this.angleA = Math.random() * 360                            // start angle (for HSL)
        this.angleB = Math.random() * 360
        this.stepA = 1.2
        this.stepB = 0.7; 
    }
    draw(gameContext) {
        const size = gameContext.get().foodSize

        _.each(gameContext.get().food, (v, k) => {
            if (v.length > 2 && v[2] == 1) {

                console.log("special")
                //checking if special ball is activated
                this.ctx.fillStyle = this.createGradient();
                // ctx.fillText(k, v.posx, v.posy-5)
                this.ctx.beginPath();
                //v[0]+size/2 because server thinks this is a rectangle. uncomment stroke rect to understand
                this.ctx.arc(v[0] + size / 2, v[1] + size / 2, size / 2, 0, 2 * Math.PI);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = 'purple';
                // ctx.fillText(k, v.posx, v.posy-5)
                this.ctx.beginPath();
                //v[0]+size/2 because server thinks this is a rectangle. uncomment stroke rect to understand
                this.ctx.arc(v[0] + size / 2, v[1] + size / 2, size / 2, 0, 2 * Math.PI);
                this.ctx.fill();
                // this.ctx.fillRect(v[0], v[1],1,1)
                // this.ctx.strokeRect(v[0], v[1], size, size);
            }
        })
    }

    createGradient() { //direct from so
        var gr = this.ctx.createLinearGradient(0, 0, 500, 0);               // create gradient
        gr.addColorStop(0, "hsl(" + (this.angleA % 360) + ",100%, 50%)");   // start color
        gr.addColorStop(1, "hsl(" + (this.angleB % 360) + ",100%, 50%)");   // end color
        
        this.angleA += this.stepA;                                               // increase angles
        this.angleB += this.stepB;             
        return gr;                                            // set as fill style
    }
}