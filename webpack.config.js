var path = require("path")
module.exports = {
    entry: {
        main: './src/index.js',
        customRoom: './src/customroom.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    }
};