/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'

function ProtectedComponent({isLogged , setIsLogged, children}) { 
    const [token , setToken] = useState(localStorage.getItem('token') || null)

    useEffect(() => { 

        axios.post('http://localhost:3000/auth' , {} , { 
            headers : { 
                Authorization : token
            }
        }).then(() => { 
            setIsLogged(true)
        }).catch(() => { 
            setIsLogged(false)
        })

    }, [token])

    if (isLogged) { 
        return children
    }

    return ( 
        <div className="normal">
            <p>unAuthorized Access. please head to <Link to={'/login'}>Login Page</Link> OR <Link to={'/signup'}>Signup Page</Link></p>
        </div>
    )
}

export default ProtectedComponent