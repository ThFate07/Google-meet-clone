import {} from "socket.io-client";

export default class Peers {
  constructor(localStream, socket, roomId) {
    this.servers = {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    };

    this.roomId = roomId
    this.socket = socket
    // new connection
    this.connection = new RTCPeerConnection(this.servers);

    
    // adding track
    localStream.getTracks().forEach(track => { 
      this.connection.addTrack(track, localStream)
    })
    

  }

  async createOffer() {
    
    
    this.connection.onicecandidate = (event) => { 
      if (event.candidate) { 
        this.socket.emit("sdp-offer", this.connection.localDescription, this.roomId);
      }
    }
      
    const offer = await this.connection.createOffer()
    await this.connection.setLocalDescription(offer) 
    
      
    return offer
  }

  async genAnswer(offer) {
    

    await this.connection.setRemoteDescription(offer);

    this.connection.onicecandidate = (event) => { 
      if (event.candidate) { 
        this.socket.emit('sdp-answer', this.connection.localDescription, this.roomId)
        
      }
    }

    const answer = await this.connection.createAnswer() 
    await this.connection.setLocalDescription(answer)

    return answer
  }


  async acceptAns(answer) {
    return await this.connection.setRemoteDescription(answer);
  }
}

