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

    socket.on("newIceCandidate", (username, iceCandidate) => {
        let updateSocket = clientList.filter(socket => socket.username !== username)[0];
        console.log(`Received new ICE candidate from ${username}, sending to ${updateSocket.username}`);
        updateSocket?.emit("updateIceCandidate", iceCandidate);
    });

    socket.on("saveOffer", (offer) => {
        console.log("Received offer from:", socket.username);
        const getAnswerCallback = (answer) => {
            console.log("Received answer from bob");
            socket.emit('getAnswer', answer);
        }
        var recSocket = clientList.filter(socket => socket.username == 'bob')[0];
        console.log("recSocket username:", recSocket?.username);
        recSocket?.emit("getOffer", offer, getAnswerCallback);
        console.log("Sent offer to", recSocket?.username);
    });
});