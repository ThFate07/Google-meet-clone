import { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function Signup() { 
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');
    const [error , setError] = useState('')
    const navigate = useNavigate()

    function handleClick() { 
        if (password !== confirmPassword) {
            setError(<p className='error'>please enter matching password</p>)
            return;
        }

        axios.post('http://localhost:3000/signup' , {
            username,
            password
        }).then(response => { 
            let serverResponse = response.data
            localStorage.setItem('token' , serverResponse.token);
            navigate('/dashboard')
        }).catch(res => { 
            setError(<p  className='error'>{res.response.data.message}</p>)
        })
    }
    return ( 
        <div className="background">

            <div className="login-container">
                <div className="login">
                    
                    <h1>Signup</h1>
                    <hr></hr>
                    <input placeholder='Username'  onChange={(e) => setUsername(e.target.value)}></input>
                    <input  placeholder='Password'  onChange={(e) => setPassword(e.target.value)}></input>
                    <input  placeholder='Confirm Password'  onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    {error}
                    <button className='login-btn' onClick={handleClick}>Signup</button>
                    <Link to='/login 'className='login-forget'>Login instead</Link>
                </div>
            </div>

        </div>
    )
}

export default Signup