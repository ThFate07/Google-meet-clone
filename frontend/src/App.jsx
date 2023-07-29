import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import DashBoard from "./Components/DashBoard";
import Meeting from "./Components/Meeting";
import { authState, tokenState } from "./store/atom/atom";
import axios from "axios";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useEffect } from "react";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AuthenticateUser />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/meeting/:roomId" element={<Meeting />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

function AuthenticateUser() {
  const setAuth = useSetRecoilState(authState);
  const tokenValue = useRecoilValue(tokenState);
 
  useEffect(() => {
    axios.post("http://localhost:3000/auth",{},{
      headers: {
        Authorization: tokenValue,
      },
    }).then(() => {
      setAuth(true);
    }).catch(() => {
      setAuth(false);

    });
  }, [tokenValue]);
  
}

export default App;
