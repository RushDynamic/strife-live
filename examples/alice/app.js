// Alice
import { StrifeLive } from '../lib.js';

const socket = io.connect("http://localhost:5250");

socket.on("connect", () => {
    console.log("Connected to signaling server, sending username");
    socket.emit("username", "alice");
    (async () => {
        console.log("Creating peer connection");
        StrifeLive.createPeerConnection();
        console.log("Setup data channel");
        StrifeLive.setupChannel("channel");
        const offer = await StrifeLive.createOffer();
        console.log("Created offer:", offer);
        socket.emit("saveOffer", offer);
        socket.on("getAnswer", async (answer) => {
            console.log("Received answer from bob");
            await StrifeLive.setAnswer(answer);
            StrifeLive.sendMessage("Hey Bob, this is Alice!");
            console.log("Sent message to Bob");
        });
    })().catch(err => {
        console.error(err);
    })
});