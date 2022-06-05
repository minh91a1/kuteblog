import './App.css';
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from './firebase-config';
import { useNavigate } from "react-router-dom";

function App() {
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"))
  
    return <Router>
      <Routes>
        <Route path='/kuteblog' element={ <Home isAuth={isAuth} setIsAuth={setIsAuth} /> } />
        <Route path='/kuteblog/createpost' element={ <EditPost isAuth={isAuth} /> } />
        <Route path='/kuteblog/editpost' element={ <EditPost isAuth={isAuth} /> } >
            <Route path=':postId' element={ <EditPost isAuth={isAuth} /> } ></Route>
        </Route>
        <Route path='/kuteblog/login' element={ <Login setIsAuth={setIsAuth} /> } />
      </Routes>
    </Router>
  }

export default App;
