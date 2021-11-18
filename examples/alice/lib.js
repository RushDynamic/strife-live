class StrifeLive {
    constructor() {
        this._peerConnectionConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    }
    createPeerConnection(config = this._peerConnectionConfig) {
        const peerConnection = new RTCPeerConnection(config);
        this.peerConnection = peerConnection;
    }

    async createOffer(offerCandidates, answerCandidates) {
        this.peerConnection.onicecandidate = function (e) {
            console.log("Received ICE candidate:", JSON.stringify(this.peerConnection?.localDescription))
        };
        const offerDescription = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offerDescription);
        return {
            sdp: offerDescription.sdp,
            type: offerDescription.type
        };
    }

    setupChannel(channelName) {
        const dataChannel = this.peerConnection.createDataChannel(channelName);
        dataChannel.onmessage = function (e) {
            console.log(e.data);
        }

        dataChannel.onopen = function (e) {
            console.log("Channel opened");
        }

        dataChannel.onclose = function (e) {
            console.log("Channel closed");
        }
        this.peerConnection.dc = dataChannel;
    }

    sendMessage(message) {
        this.peerConnection.dc.send(message);
    }

    receiveChannel() {
        this.peerConnection.ondatachannel = (e) => {
            this.peerConnection.dc = e.channel;
            this.peerConnection.dc.onmessage = e => console.log("New message:", e.data);
            this.peerConnection.dc.onopen = e => console.log("Data channel opened");
        }
    }

    async setOffer(offer) {
        await this.peerConnection.setRemoteDescription(offer);
        console.log("Done setting offer");
    }
    async createAnswer() {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        console.log("Completed creating answer:", JSON.stringify(this.peerConnection.localDescription));
        return answer;
    }

    async setAnswer(answer) {
        await this.peerConnection.setRemoteDescription(answer);
        console.log("Done setting answer");
    }
}

const instance = new StrifeLive();
export { instance as StrifeLive };