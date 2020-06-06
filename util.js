const _ = require('lodash')
const consts = {
    outterBlocks: 12,
    blockSize: 32,
    foodSize: 24
}
const initUser = (userid, color, gameContext) => {
    return gameContext.users[userid] = {
        posx: randomX(gameContext),
        posy: randomY(gameContext),
        color: color.toLowerCase(),
        score: 0,
        justEaten: 0,
        justEatenSpecial: 0,
        justEatenPlayer: { num: 0, color: 'black' },
        special: false,
        blocks: 0
    }
}
const checkForCollision = (userObj, blocks, blockSize) => {
    let x = 0
    let y = 0
    let s = blockSize
    let collided = false
    blocks.forEach((v, i) => {
        x = v[0]
        y = v[1]
        // console.log(v)
        // try to improve this
        // || (x < (userObj.posx + s) && (x > userObj.posx)
        //     && (y > userObj.posy) && (y < (userObj.posy + s))
        if ((userObj.posx < x + s &&
            (userObj.posx + s > x) &&
            (userObj.posy < y + s) &&
            (userObj.posy + s > y)
        )
        ) {
            // userObj.posx -= (x-userObj.posx)
            // userObj.posy -= (y-userObj.posy)
            console.log("HIT")
            collided = true
        }
    })
    return collided
}
const handleInput = (keys, blocks, gameContext, userid) => {
    //if player has just eaten, minus the eaten flag
    const food = gameContext.food
    const foodSize = gameContext.foodSize
    const blockSize = gameContext.blockSize
    const userBlocks = gameContext.userBlocks
    let userObj = gameContext.users[userid]

    userObj.justEaten = userObj.justEaten > 0 ? userObj.justEaten - 1 : 0
    userObj.justEatenSpecial = userObj.justEatenSpecial > 0 ? userObj.justEatenSpecial - 1 : 0

    if (userObj.special && userObj.justEatenSpecial <= 0) {
        userObj.special = false
    }
    userObj.justEatenPlayer.num = userObj.justEatenPlayer.num > 0 ? userObj.justEatenPlayer.num - 1 : 0
    speed = 14
    const ogUserObj = Object.assign({}, userObj);
    keys.forEach(key => {
        switch (key) {
            case "w":
                userObj.posy -= speed
                break
            case "a":
                userObj.posx -= speed
                break
            case "s":
                userObj.posy += speed
                break
            case "d":
                userObj.posx += speed
                break
            default:
                break
        }
    });
    // if (checkForCollision(userObj, blocks, blockSize)) {
    //     userObj = Object.assign({}, ogUserObj);
    // }
    if (userObj.posx <= consts.outterBlocks * consts.blockSize ||
        userObj.posx >= gameContext.mapSize.width - (consts.outterBlocks * consts.blockSize) ||
        userObj.posy <= consts.outterBlocks * consts.blockSize ||
        userObj.posy >= gameContext.mapSize.height - (consts.outterBlocks * consts.blockSize)) {
            userObj = Object.assign({}, ogUserObj);
    }
    if (checkForCollision(userObj, userBlocks, blockSize)) {

        userObj = Object.assign({}, ogUserObj);
    }
    userObj = handlePlayerEatFood(userObj, food, foodSize)
    gameContext.users[userid] = userObj

}
const handlePlayerEatPlayer = (gameObj) => {
    // console.log(gameObj)
    const players = _.keys(gameObj.users)
    const s = gameObj.blockSize
    for (var i = 0; i < players.length; i++) {
        const curPlayer = gameObj.users[players[i]]
        for (var j = i + 1; j < players.length; j++) {
            const otherPlayer = gameObj.users[players[j]]
            if (curPlayer.posx < otherPlayer.posx + s &&
                (curPlayer.posx + s > otherPlayer.posx) &&
                (curPlayer.posy < otherPlayer.posy + s) &&
                (curPlayer.posy + s > otherPlayer.posy)
            ) {
                console.log("Players colliding")
                if (curPlayer.special) {
                    gameObj.users[players[j]].score = Math.floor(gameObj.users[players[j]].score / 2)
                    gameObj.users[players[j]].posx = randomX(gameObj)
                    gameObj.users[players[j]].posy = randomY(gameObj)
                    gameObj.users[players[i]].special = false //reset after eating
                    gameObj.users[players[i]].justEatenPlayer.color = gameObj.users[players[j]].color
                } else if (otherPlayer.special) {
                    gameObj.users[players[i]].score = Math.floor(gameObj.users[players[i]].score / 2)
                    gameObj.users[players[i]].posx = randomX(gameObj)
                    gameObj.users[players[i]].posy = randomY(gameObj)
                    gameObj.users[players[j]].special = false //reset after eating
                    gameObj.users[players[J]].justEatenPlayer.color = gameObj.users[players[i]].color
                }
                else if (curPlayer.score == otherPlayer.score) {
                    continue
                }
                else if (curPlayer.score > otherPlayer.score) {
                    console.log("deleting " + players[j])
                    gameObj.users[players[j]].score = Math.floor(gameObj.users[players[j]].score / 2)
                    gameObj.users[players[j]].posx = randomX(gameObj)
                    gameObj.users[players[j]].posy = randomY(gameObj)
                    gameObj.users[players[i]].justEatenPlayer.num = 10 // not a typo
                    gameObj.users[players[i]].justEatenPlayer.color = gameObj.users[players[j]].color // not a typo
                } else {
                    console.log("deleting " + players[i])
                    gameObj.users[players[i]].score = Math.floor(gameObj.users[players[i]].score / 2)
                    gameObj.users[players[i]].posx = randomX(gameObj)
                    gameObj.users[players[i]].posy = randomY(gameObj)
                    gameObj.users[players[j]].justEatenPlayer.num = 10 // not a typo
                    gameObj.users[players[j]].justEatenPlayer.color = gameObj.users[players[i]].color // not a typo
                }
                console.log(gameObj)
            }
        }
    }

}
const random = (floor, ceiling) => {
    return _.random(floor, ceiling - (2 * floor))
}
const handlePlayerEatFood = (userObj, food, foodSize) => {

    let x = 0
    let y = 0
    let s = foodSize + 4 // increased food size for broader detection
    let collided = false

    food.forEach((v, i) => {
        x = v[0] - 4 //I know this will come to bite me later
        y = v[1] - 4 //but don't care
        // console.log(v)
        // try to improve this
        // || (x < (userObj.posx + s) && (x > userObj.posx)
        //     && (y > userObj.posy) && (y < (userObj.posy + s))
        if ((userObj.posx < (x + s)) &&
            ((userObj.posx + s) > x) &&
            (userObj.posy < (y + s)) &&
            ((userObj.posy + s) > y)
        ) {
            if (v.length > 2 && v[2] == 1) { //special food is consumed
                userObj.special = true
                console.log("ATE SPECIAL FOOD")
                collided = true
                food.splice(i, 1)
                userObj.score += 1
                userObj.justEatenSpecial += 100
            } else if (v.length > 2 && v[2] == 2) {
                userObj.blocks += 1
                console.log("ATE BLOCK FOOD")
                collided = true
                food.splice(i, 1)
            } else {

                console.log("ATE FOOD")
                collided = true
                food.splice(i, 1)
                userObj.score += 1
                userObj.justEaten += 8
            }
        }
    })


    return userObj
}
const handleInputJoystick = (vector, userObj) => {
    speed = 10
    userObj.posx += (vector.x * speed)
    userObj.posy -= (vector.y * speed)
    return userObj
}

const generateMap = ({ height, width }, blockSize) => {
    var blocks = []
    const startx = blockSize * consts.outterBlocks
    const starty = blockSize * consts.outterBlocks
    const endx = width - (blockSize * consts.outterBlocks)
    const endy = height - (blockSize * consts.outterBlocks)
    for (var x = 0; x < width; x += blockSize) {
        for (var y = 0; y < height; y += blockSize) {
            if (x < startx || y < starty
                || x > endx || y > endy) {
                blocks.push([x, y])
            }
        }
    }
    return blocks
}
const generateFood = (currentFood, { height, width }, blocks, blockSize) => {
    if (currentFood === null) {
        var food = []
    } else {
        var food = currentFood
    }
    const numOfFood = 30 - food.length
    for (var i = 0; i < numOfFood; i++) {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        if (checkForCollision({ posx: x, posy: y }, blocks, blockSize)) {
            continue
        } else {
            if (Math.random() < 0.05) {
                food.push([x, y, 1])
                console.log('special')
            } else if (Math.random() < 0.05) {
                console.log('block ball')
                food.push([x, y, 2])
            } else {
                food.push([x, y])
            }
        }
        // console.log("food", [x, y])
    }
    return food
}
const randomX = (gameObj) => {
    return _.random(consts.outterBlocks * gameObj.blockSize, gameObj.mapSize.width - (consts.outterBlocks * gameObj.blockSize))
}
const randomY = (gameObj) => {
    return _.random(consts.outterBlocks * gameObj.blockSize, gameObj.mapSize.height - (consts.outterBlocks * gameObj.blockSize))

}
const vanishAfter = (secs, gameContext, pos) => {
    var vanish = setTimeout(() => {
        gameContext.userBlocks.map((v, i) => {
            if (v[0] === pos[0] && v[1] === pos[1]) {
                gameContext.userBlocks.splice(i, 1)
            }
        })
        clearTimeout(vanish)
        console.log("Deleting ", vanish, " and block")
    }, secs * 1000)
}
module.exports = {
    handleInput,
    handleInputJoystick,
    handlePlayerEatPlayer,
    generateMap,
    generateFood,
    random,
    consts,
    randomX,
    randomY,
    initUser,
    vanishAfter
}