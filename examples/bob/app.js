// Bob
import { StrifeLive } from './lib.js';

const socket = io.connect("http://localhost:5250");

socket.on("connect", () => {
    console.log("Connected to signaling server, sending username");
    socket.emit("username", "bob");
    (async () => {
        // Callback for handling changes to ICE candidate
        const onIceCandidateCallback = (username, iceCandidate) => {
            socket.emit("newIceCandidate", username, iceCandidate);
        };

        console.log("Creating peer connection");
        StrifeLive.createPeerConnection(onIceCandidateCallback, "bob");

        socket.on("updateIceCandidate", (iceCandidate) => {
            StrifeLive.addIceCandidate(iceCandidate);
            console.log("Added new ICE candidate");
        });

        socket.on('getOffer', async (savedOffer, getAnswerCallback) => {
            console.log("Received offer from server",);
            await StrifeLive.setOffer(savedOffer);
            StrifeLive.receiveChannel();
            const answer = await StrifeLive.createAnswer();
            console.log("Created answer");
            getAnswerCallback(answer);
        });
    })().catch(err => {
        console.error(err);
    })
});