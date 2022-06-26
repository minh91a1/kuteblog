import "./App.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import NewHome from "./pages/NewHome"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import NewCreateEditPost from "./pages/NewCreateEditPost"
import Login from "./pages/Login"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "./firebase-config"
import { useNavigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"))

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/kuteblog"
            element={<NewHome isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <Route
            path="/kuteblog/createpost"
            element={<NewCreateEditPost isAuth={isAuth} />}
          />
          <Route
            path="/kuteblog/editpost"
            element={<NewCreateEditPost isAuth={isAuth} />}
          >
            <Route
              path=":postId"
              element={<NewCreateEditPost isAuth={isAuth} />}
            ></Route>
          </Route>
          <Route
            path="/kuteblog/login"
            element={<Login setIsAuth={setIsAuth} />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
