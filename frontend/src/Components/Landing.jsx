import { Link } from "react-router-dom"

function Landing() { 
 return ( 
    <>
        <NavBar/>
        <Hero/>
        
    </>
 )
}


function NavBar() { 
    // height 167px
    return (
        <div className="nav">
            <div className="flex-container">

                <div className="brand">
                    <h1>Home Meet</h1>
                </div>
                <div className="buttons">
                    <Link to={'/signup'} className="btn ">Signup</Link>
                    <Link to={'/login'} className="btn">Login</Link>
                </div>
            </div>
        </div>
    )
}

function Hero() { 

    return ( 
        <div className="hero">
            <div className="container">

                <p>
                    A video calling app
                </p>
                <p className="belowp">
                    just like google meet
                </p>
            </div>
        </div>
    )
}
export default Landing