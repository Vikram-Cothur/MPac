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

            console.log("HIT")
            collided = true
        }
    })
    return collided
}
const handleInput = (keys, userObj, blocks, blockSize, food, foodSize) => {
    speed = 10
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
    if (checkForCollision(userObj, blocks, blockSize)) {
        userObj = Object.assign({}, ogUserObj);
    }
    userObj = handlePlayerEatFood(userObj, food, foodSize)
    return userObj
}
const handlePlayerEatFood = (userObj, food, foodSize) => {

    let x = 0
    let y = 0
    let s = foodSize
    let collided = false

    food.forEach((v, i) => {
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

            console.log("ATE FOOD")
            collided = true
            food.splice(i,1)
            userObj.score += 1
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
    for (var x = 0; x < width; x += blockSize) {
        for (var y = 0; y < height; y += blockSize) {
            if (x < blockSize || y < blockSize
                || x == (width - blockSize) || y == (height - blockSize)) {
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
            food.push([x, y])
        }
        // console.log("food", [x, y])
    }
    return food
}
module.exports = {
    handleInput,
    handleInputJoystick,
    generateMap,
    generateFood
}