const handleInput = (keys, userObj) => {
    speed = 10
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
    generateMap
}