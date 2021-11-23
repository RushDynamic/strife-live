var clientList = [];
const io = require("socket.io")(5250, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    socket.on("username", (username) => {
        console.log("Socket connected:", username);
        socket.username = username;
        clientList.push(socket);
    });

    socket.on("getOffer", (offer) => {
        socket.broadcast.emit("getOffer", offer);
    });

    socket.on("getAnswer", (answer) => {
        console.log("Received answer from Bob");
        socket.broadcast.emit("getAnswer", answer);
    });

    socket.on('newIceCandidate', (iceCandidate) => {
        socket.broadcast.emit('getIceCandidate', iceCandidate);
    });
});