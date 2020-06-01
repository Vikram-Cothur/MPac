export default class Food {
    constructor(ctx) {
        this.ctx = ctx
        console.log("ctx", ctx)
    }
    draw(gameContext) {
        const size = gameContext.foodSize

        _.each(gameContext.food, (v, k) => {
            this.ctx.fillStyle = 'purple';
            // ctx.fillText(k, v.posx, v.posy-5)
            this.ctx.beginPath();
            //v[0]+size/2 because server thinks this is a rectangle. uncomment stroke rect to understand
            this.ctx.arc(v[0]+size/2, v[1]+size/2, size/2, 0, 2 * Math.PI);
            this.ctx.fill();
            // this.ctx.strokeRect(v[0], v[1], size, size);
        })
    }
}