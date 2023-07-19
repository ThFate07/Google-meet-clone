import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './Components/Landing'
import Login from './Components/Login';
import Signup from './Components/Signup';
import DashBoard from './Components/DashBoard';
import Meeting from './Components/Meeting';
function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/dashboard' element={<DashBoard/>}/>
          <Route path='/meeting/:roomId' element={<Meeting/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
