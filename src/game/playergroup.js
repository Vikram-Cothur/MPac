import Player from './player'
export default class PlayerGroup {

    constructor(ctx, gameContext, userid) {
        this.ctx = ctx
        this.userid = userid
        this.players = []
        this.gameContext = gameContext
        this.refreshPlayers()
    }
    draw() {
        for (let player of this.players) {
            player.draw(this.ctx)
        }
    }
    refreshPlayers() {
        this.players = []
        console.log("refresh on players called")
        let gameContext = this.gameContext.get()
        let users = Object.entries(gameContext.users)

        users.map((v) => {
            const name = v[0]
            const isUser = this.userid === name
            const newPlayer = new Player(this.gameContext, name, v[1], isUser)
            this.players.push(newPlayer)
        })
    }
    log() { console.log(this.players) }
}