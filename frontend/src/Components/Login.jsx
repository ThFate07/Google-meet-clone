import { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';


function Login() { 
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [error , setError] = useState('')
    const navigate = useNavigate();

    function handleClick() { 
        axios.post('http://localhost:3000/login' , {
            username,
            password
        }).then((response) => { 
            
            localStorage.setItem('token' , response.data.token)
            navigate('/dashboard');
        }).catch(res => { 
            setError(<p  className='error'>{res.response.data.message}</p>)
        })
    }
    return ( 
        <div className="background">

            <div className="login-container">
                <div className="login">
                    
                    <h1>Login</h1>
                    <hr></hr>
                    <input placeholder='Username' className='placeholder-red-300 placeholder-opacity-100' onChange={(e) => setUsername(e.target.value)}></input>
                    <input  placeholder='Password' className='placeholder-white placeholder-opacity-100' onChange={(e) => setPassword(e.target.value)}></input>
                    {error}
                    <button className='login-btn' onClick={handleClick}>Log In</button>
                    <Link className='login-forget'>Did you forget your password?</Link>
                </div>
            </div>

        </div>
    )
}

export default Login