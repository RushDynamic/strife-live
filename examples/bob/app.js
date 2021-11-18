// Bob
import { StrifeLive } from './lib.js';

const socket = io.connect("http://localhost:5250");

socket.on("connect", () => {
    console.log("Connected to signaling server, sending username");
    socket.emit("username", "bob");
    (async () => {
        console.log("Creating peer connection");
        StrifeLive.createPeerConnection();
        socket.on('getOffer', async (savedOffer, getAnswerCallback) => {
            console.log("Received offer from server");
            StrifeLive.receiveChannel();
            await StrifeLive.setOffer(savedOffer);
            const answer = await StrifeLive.createAnswer();
            console.log("Created answer");
            getAnswerCallback(answer);
        });
    })().catch(err => {
        console.error(err);
    })
});