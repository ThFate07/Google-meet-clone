/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import cameraLogo from "/icons/camera.png";
import micLogo from "/icons/mic.png";
import phoneLogo from "/icons/phone.png";
import { useRecoilValue } from "recoil";
import { authState } from "../store/atom/atom";
import { ErrorComponent } from "./DashBoard";

function Meeting() {
  const authValue = useRecoilValue(authState);

  return <>{authValue ? <JoinMetting /> : <ErrorComponent />}</>;
}

function JoinMetting() {
  const [localStream, setLocalStream] = useState(null);
  const [inMeeting, setInMeeting] = useState(false);
  const { roomId } = useParams();

  const style = {
    height: "500px",
    width: "50%",
    backgroundColor: "black",
  };

  async function init() {
    setLocalStream(
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    );
  }

  useEffect(() => {
    init();
  }, [inMeeting]);

  if (inMeeting)
    return <ViewMeeting localStream={localStream} roomId={roomId} />;

  return (
    <div className="background">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <div>
          <p>Hair check.</p>
          <Video
            localStream={localStream}
            style={style}
            givenId={"check-hair"}
          />
          <button onClick={() => init()}>Use Cam</button>
        </div>
        <div>
          <p>Welcome to meeting {roomId}</p>
          <button className="dash-btn" onClick={() => setInMeeting(true)}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

function Video({ localStream, style, givenId }) {
  useEffect(() => {
    document.getElementById(givenId).srcObject = localStream;
  }, [localStream]);

  return <video id={givenId} style={style} autoPlay playsInline></video>;
}

function ViewMeeting({ localStream, roomId }) {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [joinEventExecuted, setJoinEventExecuted] = useState(false);
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };
  const peerConnection = new RTCPeerConnection(servers);
  const URL = "http://localhost:4000";
  const socket = io(URL);

  const toggleCamera = async () => {
    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    videoTrack.enabled = !videoTrack.enabled;
    console.log(videoTrack.enabled, "after");
  };

  const toggleMic = async () => {
    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    audioTrack.enabled = !audioTrack.enabled;
  };

  async function createOffer(socket, peerConnection) {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sdp-offer", peerConnection.localDescription, roomId);
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  }

  function socketEvents(socket, peerConnection) {
    socket.on("sdp-offer", async (offer) => {
      await peerConnection.setRemoteDescription(offer);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("sdp-answer", peerConnection.localDescription, roomId);
        }
      };

      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answer);

      const newRemoteStream = new MediaStream();

      // after establishing connection add video track to current window
      peerConnection.getReceivers().forEach((reciver) => {
        newRemoteStream.addTrack(reciver.track);
      });
      setRemoteStream(newRemoteStream);
    });

    socket.on("joined", () => {
      createOffer(socket, peerConnection);
    });

    socket.on("sdp-answer", (answer) => {
      peerConnection.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
      };

      peerConnection.setRemoteDescription(answer);
    });

    socket.on("disconnected", () => {
      peerConnection.close();

      peerConnection = new RTCPeerConnection(servers);

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      setRemoteStream(new MediaStream());
    });
  }

  async function init() {
    if (!joinEventExecuted) {
      socket.emit("joined", roomId);
      setJoinEventExecuted(true);
    }

    socketEvents(socket, peerConnection);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }

  function handleDisconnect() {
    peerConnection.close();
    socket.emit("disconnect");
  }

  useEffect(() => {
    init();
  }, []);


  return (
    <div className="">
      <div className=" background gap">
        <Video localStream={localStream} givenId={"user-1"} />
        <Video localStream={remoteStream} givenId={"user-2"} />
      </div>
      <div className="controls">
        <ControlComponent id={"camera-btn"} image={cameraLogo} onClick={toggleCamera}/>
        <ControlComponent id={"mic-btn"} image={micLogo} onClick={toggleMic}/>
        <Link to={"/dashboard"} onClick={handleDisconnect}>
          <div className="control-container" id="leave-btn">
            <img src={phoneLogo}></img>
          </div>
        </Link>
      </div>
    </div>
  );


}

function ControlComponent(props) {
    const [isOn, setIsON] = useState(true);

    function handleClick() {
      setIsON(!isOn);
        props.onClick()
    }
    
    return (
      <div
        className="control-container"
        id={props.id}
        onClick={handleClick}
        style={
          isOn
            ? { backgroundColor: "rgb(179, 102, 249, .9)" }
            : { backgroundColor: "rgb(255, 80, 80)" }
        }
      >
        <img src={props.image}></img>
      </div>
    );
}

export default Meeting;
