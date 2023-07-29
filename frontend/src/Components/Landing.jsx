import { Link } from "react-router-dom";
import authState, { tokenState } from "../store/atom/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
function Landing() {
  return (
    <>
      <NavBar />
      <Hero />
    </>
  );
}

function NavBar() {
  const authValue = useRecoilValue(authState);
  const tokenSetter = useSetRecoilState(tokenState);

  function handleClick() {
    localStorage.removeItem("token");
    tokenSetter("");
  }
  
  return (
    <div className="nav">
      <div className="flex-container">
        <div className="brand">
          <h1>Home Meet</h1>
        </div>
        {authValue ? (
          <div className="buttons">
            <Link to={"/dashboard"} className="btn ">
              Meeting
            </Link>
            <Link className="btn" onClick={handleClick}>
              Logout
            </Link>
          </div>
        ) : (
          <div className="buttons">
            <Link to={"/signup"} className="btn ">
              Signup
            </Link>
            <Link to={"/login"} className="btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <p>A video calling app</p>
        <p className="belowp">just like google meet</p>
      </div>
    </div>
  );
}
export default Landing;
