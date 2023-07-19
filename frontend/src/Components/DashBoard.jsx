import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashBoard() { 
    const navigate = useNavigate();
    const [error , setError] = useState('')
    const [roomId , setRoomId] = useState('');

    async function createMeeting() { 
        let response = await axios.post('http://localhost:3000/create-meeting')
        let meetingId = response.data.id;
        navigate(`/meeting/${meetingId}`)
    }

    function joinMeeting() { 
        if (!roomId) { 
            setError(<p className='error'>Please enter a meeting id</p>)
            return
        }

        // check if the meeting id exists in database 
        // note : adding the meeting to database is pending right now 

        // if present navigate to meeting room
        navigate(`/meeting/${roomId}`)

    }
    return ( 
        <div className="background">
            <div className="flex-container gap">

                <div>

                    <button className="dash-btn" onClick={createMeeting}>Create meeting</button>
                </div>
                <div>

                    <input type="text" className="dash-input" required onChange={e => setRoomId(e.target.value)}></input>
                    {error}
                    <button className="dash-btn" onClick={joinMeeting}>Join meeting</button>
                </div>
            </div>
        </div>
    )
}

export default DashBoard