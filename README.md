# Strife Live
Strife Live is a wrapper library for VoIP using WebRTC.
It is a plug-and-play solution that takes care of the underlying WebRTC configuration, making it easier for you to implement VoIP in your projects.

# Examples
You can find sample code and examples of how to create and accept calls, and a basic signalling server powered by Socket.IO inside the [examples](https://github.com/RushDynamic/strife-live/tree/develop/examples) folder

## Participants
## *Alice*
Alice acts as the caller.
#### Connect to Server
This method establishes a websocket connection between Alice and the Signaling Server. This connection serves as the initial medium for exchanging the information required to setup the WebRTC connection. 

It then invokes `navigator.mediaDevices.getUserMedia({ audio: true })` to receive the user's permission to fetch the audio stream. This stream is required to setup the WebRTC Peer Connection object. 

It also sets up various event handlers for communicating with the Signaling Server, as well as for the WebRTC connection itself.
One notable event handler is `getAnswer`, which is used for receiving the answer that Bob sends to the Signaling Server.

#### Place Call
This method creates a new offer and broadcasts it to the Signaling Server.

---
## *Bob*
Bob acts as the receiver.
#### Connect to Server
This method is identical to what has been described for Alice with the exception of one event handler. Instead of `getAnswer`, Bob has `getOffer`, which is used to receive the initial offer from Alice.

#### Answer Call
This method creates a new answer and broadcasts it to the Signaling Server.

---
## *Signaling Server*
The Signaling Server is a basic websockets server powered by Socket.IO that simply relays the initial configuration information between Alice and Bob.
