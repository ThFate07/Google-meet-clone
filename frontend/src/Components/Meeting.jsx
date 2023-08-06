/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import cameraLogo from "/icons/camera.png";
import micLogo from "/icons/mic.png";
import phoneLogo from "/icons/phone.png";
import { useRecoilValue } from "recoil";
import { authState } from "../store/atom/atom";
import { ErrorComponent } from "./DashBoard";
import Peers from "../services/peerConnection";
import Meetings from "../css/Meetings.module.css";
import dashboard from '../css/dashboard.module.css';

function Meeting() {
  const authValue = useRecoilValue(authState);

  return <>{authValue ? <JoinMetting /> : <ErrorComponent />}</>;
}

function JoinMetting() {
  const [localStream, setLocalStream] = useState(new MediaStream());
  const [inMeeting, setInMeeting] = useState(false);
  const { roomId } = useParams();

  // const style = {
  //   backgroundColor: "black",
  //   width: "512px",
  //   height: "400px"
  // };

  async function init() {
    
    setLocalStream(
      // turn audio on
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    );
  }

  useEffect(() => {
    init();
  }, []);

  if (inMeeting)
    return (
      <ViewMeeting
        localStream={localStream}
        roomId={roomId}
        inMeeting={inMeeting}
      />
    );

  return (
    <div className={`background ${dashboard.dashboardFont}`}>
      <div style={{
        textAlign: 'center'
      }}>
        <h1 style={{
          marginBottom: '30px',
          fontSize: '25px'
        }}>  Welcome to meeting {roomId}</h1>
        <div>
          <span>Hair check.</span>
          
          <Video
            localStream={localStream}
            givenClass={dashboard.hairCheckVideo}
            givenId={Meetings.hairCheckVideo}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>

            <button onClick={() => init()}>Camera not working? press me </button>
            <button className="dash-btn" onClick={() => setInMeeting(true)}>
              Join Meeting
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function ViewMeeting({ localStream, roomId, inMeeting }) {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [joinEventExecuted, setJoinEventExecuted] = useState(false);
  const [frameClass, setFrameClass] = useState();

  const URL = "http://localhost:4000";
  const socket = io(URL);
  let peer = useRef(new Peers(localStream, socket, roomId));

  const toggleCamera = async () => {
    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");
    videoTrack.enabled = !videoTrack.enabled;
  };

  const toggleMic = async () => {
    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    audioTrack.enabled = !audioTrack.enabled;
  };

  const handleDisconnect = () => {
    peer.current.connection.close();
    setRemoteStream(new MediaStream());
    socket.emit("disconnect");
  };

  function socketEvents(socket) {
    socket.on("joined", async () => {
      setFrameClass(Meetings.smallFrame);

      await peer.current.createOffer();
    });

    socket.on("sdp-offer", async (offer) => {
      setFrameClass(Meetings.smallFrame);
      await peer.current.genAnswer(offer);
    });

    socket.on("sdp-answer", async (answer) => {
      await peer.current.acceptAns(answer);
    });

    socket.on("disconnected", async () => {
      setFrameClass();
      peer.current.connection.close();

      peer.current = new Peers(localStream, socket, roomId);


      peer.current.connection.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
      };

      setRemoteStream(new MediaStream());
    });
  }

  async function init() {
    if (!joinEventExecuted) {
      socket.emit("joined", roomId);
      setJoinEventExecuted(true);
    }

    // peer = new Peers(localStream, socket, roomId);

    socketEvents(socket);

    peer.current.connection.ontrack = (e) => {
      setRemoteStream(e.streams[0]);
    };
  }

  useEffect(() => {
    if (inMeeting) {
      init();
    }
  }, [inMeeting]);

  return (
    <div className="">
      <div className={Meetings.videos}>
        <Video localStream={localStream} givenClass={frameClass} givenId={"user-1"} />
        <Video localStream={remoteStream} givenId={"user-2"} />
      </div>
      <div className="controls">
        <ControlComponent
          id={"camera-btn"}
          image={cameraLogo}
          onClick={toggleCamera}
        />
        <ControlComponent id={"mic-btn"} image={micLogo} onClick={toggleMic} />
        <Link to={"/dashboard"} onClick={handleDisconnect}>
          <div className="control-container" id="leave-btn">
            <img src={phoneLogo}></img>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Video({ localStream, givenClass, givenId }) {
  useEffect(() => {
    document.getElementById(givenId).srcObject = localStream;
  }, [localStream]);

  return <video id={givenId} className={givenClass} autoPlay playsInline></video>;
}

function ControlComponent(props) {
  const [isOn, setIsON] = useState(true);

  function handleClick() {
    setIsON(!isOn);
    props.onClick();
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
