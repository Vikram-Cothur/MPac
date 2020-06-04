import Game from './game'

export default class Mother {
    constructor(socket, userid, gameContext, joystick){
        this.gameContext = this.copy(gameContext)
        this.oldGameContext = this.copy(gameContext)
        this.game = new Game(socket, userid, this, joystick)
        this.game.init()
        window.requestAnimationFrame(() => this.game.loop())
    }
    update(gameContext){
        this.oldGameContext = this.copy(this.gameContext)
        this.gameContext = this.copy(gameContext)
        if(Object.keys(this.gameContext.users).length != Object.keys(this.oldGameContext.users).length){
            console.log(gameContext, this.oldGameContext)
            this.game.players.refreshPlayers()
        }
    }
    copy(o){
        return JSON.parse(JSON.stringify(o))
    }
    getOld(){
        return this.oldGameContext
    }
    get(){
        return this.gameContext
    }
}