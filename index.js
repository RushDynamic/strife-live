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
            console.log("Received ICE candidate:", JSON.stringify(this.peerConnection.localDescription))
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
    }

    async setOffer(offer) {
        await this.peerConnection.setRemoteDescription(offer);
        console.log("Done setting offer");
    }
    async createAnswer() {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        console.log("Completed creating answer:", JSON.stringify(this.peerConnection.localDescription));
    }
}

const instance = new StrifeLive();
export { instance as StrifeLive };
