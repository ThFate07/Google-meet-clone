import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import authState from "../store/atom/atom";
import dashboard from "../css/dashboard.module.css";

function DashBoard() {
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("");
  const [btnstyle, setBtnStyle] = useState(false);
  const authValue = useRecoilValue(authState);
  const navigate = useNavigate();

  async function createMeeting() {
    let response = await axios.post(
      "http://localhost:3000/create-meeting",
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    let meetingId = response.data.id;
    navigate(`/meeting/${meetingId}`);
  }

  function joinMeeting() {
    if (!roomId) {
      setError(<p className="error">Please enter a meeting id</p>);
      return;
    }

    // check if the meeting id exists in database
    // note : adding the meeting to database is pending right now

    // if present navigate to meeting room
    navigate(`/meeting/${roomId}`);
  }

  

  useEffect(() => { 
    if (roomId.length > 0 && !btnstyle) {
      setBtnStyle(true);
    } else if (roomId.length === 0 && btnstyle) {
      setBtnStyle(false);
    }
  }, [roomId]
  )
  
  return (
    <>
      {authValue ? (
        <div className={`${dashboard.background} ${dashboard.dashboardFont}`}>
          <div className={dashboard.gridContainer}>
            {/* left section */}
            <div className={dashboard.left}>
              <div className="">
                <h3>Premium Video meetings. Now free for everyone.</h3>
                <p>
                  We re-engineered the service we built for secure business
                  meetings, Google Meet, to make it free and available for all.
                </p>
              </div>
              <div className={dashboard.btnContainer}>
                <button
                  className={dashboard.meetingbtn}
                  onClick={createMeeting}
                >
                  <span
                    className={"material-symbols-outlined " + dashboard.icon}
                  >
                    video_call
                  </span>
                  <span className={dashboard.btnname}>New meeting</span>
                </button>

                <input
                  type="text"
                  className={dashboard.meetingInput}
                  required
                  placeholder="Enter a code"
                  onChange={(e) => setRoomId(e.target.value)}
                ></input>

                <button
                  className={`${dashboard.joinbtn} ${dashboard.isActive}`}
                  style={btnstyle ? { display: "flex" } : {}}
                  onClick={joinMeeting}
                >
                  <span>Join</span>
                </button>
              </div>
            </div>

            {/* right image section */}
            <div style={{ width: "330px", justifySelf: "center" }}>
              <img src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"></img>
            </div>
          </div>
        </div>
      ) : (
        <ErrorComponent />
      )}
    </>
  );
}

export function ErrorComponent() {
  return (
    <div>
      <p>
        Unauthorized access. Please head to <Link to={"/login"}>Login</Link> OR{" "}
        <Link to={"/signup"}>Signup</Link>
      </p>
    </div>
  );
}

export default DashBoard;
