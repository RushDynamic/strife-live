// Alice
import { StrifeLive } from './lib.js';

const socket = io.connect("http://localhost:5250");

socket.on("connect", () => {
    console.log("Connected to signaling server, sending username");
    socket.emit("username", "alice");
    (async () => {
        // Callback for handling changes to ICE candidate
        const onIceCandidateCallback = (username, iceCandidate) => {
            socket.emit("newIceCandidate", username, iceCandidate);
        };

        // Create Peer Connection
        console.log("Creating peer connection");
        StrifeLive.createPeerConnection(onIceCandidateCallback, "alice");

        socket.on("updateIceCandidate", (iceCandidate) => {
            StrifeLive.addIceCandidate(iceCandidate);
            console.log("Added new ICE candidate");
        });

        // Setup Data Channel
        console.log("Setup data channel");
        StrifeLive.setupChannel("channel");

        // Create offer
        const offer = await StrifeLive.createOffer("alice");
        console.log("Created offer:", offer);

        // Call signaling server to save offer
        socket.emit("saveOffer", offer);

        // Upon receiving an answer
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