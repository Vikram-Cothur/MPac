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
            console.log(v, userObj, Date.now(), blockSize)
            console.log("HIT")
            collided = true
        }
    })
    return collided
}
const handleInput = (keys, userObj, blocks, blockSize) => {
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
        return ogUserObj
    }
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
module.exports = {
    handleInput,
    handleInputJoystick,
    generateMap
}