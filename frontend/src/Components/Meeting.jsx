/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import {io} from 'socket.io-client';
import { useParams } from "react-router-dom";
import ProtectedCompnent from './ProtectedCompnent'

function Meeting() {
    const [isLogged , setIsLogged] = useState(false) 
    const [inMeeting , setInMeeting] = useState(false)
    const {roomId} = useParams()
    

    return ( 
        <ProtectedCompnent isLogged={isLogged} setIsLogged={setIsLogged}>
            <JoinMetting inMeeting={inMeeting} roomId={roomId} setInMeeting={setInMeeting}/>
        </ProtectedCompnent>
    )
}


function JoinMetting({inMeeting ,setInMeeting , roomId}) { 
    const [localStream , setLocalStream] = useState(null)
    const [remoteStream , setRemoteStream] = useState(new MediaStream())

    
    const URL = 'http://localhost:4000'
    
    const servers = { 
        iceServers : [
          {
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
          }
        ]
    }

    async function createOffer(socket , peerConnection) { 
        
        
        peerConnection.onicecandidate = (event) => { 
            if (event.candidate) { 
                socket.emit('sdp-offer' , peerConnection.localDescription , roomId)
            }
        }

        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
    }

    function socketEvents(socket , peerConnection) { 
        socket.on('sdp-offer' , async (offer) => { 
            await peerConnection.setRemoteDescription(offer)

            peerConnection.onicecandidate = (event) => { 
                if (event.candidate) { 
                    socket.emit('sdp-answer' , peerConnection.localDescription , roomId)
                }
            }

            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)

            // after establishing connection add video track to current window
            peerConnection.getReceivers().forEach(reciver => { 
                remoteStream.addTrack(reciver.track)
            })
        })

        socket.on('joined' ,() => { 
            console.log('a user has joined')
            createOffer(socket , peerConnection)
        })
    
        socket.on('sdp-answer' ,(answer) => { 
            peerConnection.setRemoteDescription(answer).then(() => { 
                // after establishing connection add video track to current window
                peerConnection.getReceivers().forEach(reciver => { 
                    remoteStream.addTrack(reciver.track)
                })
            })
        })
    }

    async function init() { 
        const peerConnection = new RTCPeerConnection(servers)
        const socket = io(URL)

        if (inMeeting) { 

            socket.emit('joined', roomId)
    
            socketEvents(socket , peerConnection)
        }



        setLocalStream(await navigator.mediaDevices.getUserMedia({video : true, audio: false}))

        document.getElementById('user-1').srcObject = localStream;
        document.getElementById('user-2').srcObject = remoteStream;

        localStream.getTracks().forEach(track => { 
            peerConnection.addTrack(track , localStream)
        })

        

    }


    useEffect(() => { 
        

        init()
        

    }, [inMeeting])


    if (inMeeting) { 

        return (
            <div className="background gap">
                <video id="user-1" autoPlay playsInline></video>
                <video id="user-2" autoPlay playsInline></video>
            </div>
        )
    } 


    return ( 
        <div className="background">
            <div>
                <p>Welcome to meeting {roomId}</p>
                <button className="dash-btn" onClick={() => setInMeeting(true)}>Join Meeting</button>
            </div>

        </div>
    )
}


export default Meeting