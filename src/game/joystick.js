export default class Joystick {
    constructor(joystick, socket) {
        this.joystick = joystick
        this.socket = socket

        joystick.on('move',
            (evt, data) => {
                console.log(data, socket);
                socket.handleJoystick({ vector: data.vector })
            })
    }
}