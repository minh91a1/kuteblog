import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NewHome from "./pages/NewHome"
import NewCreateEditPost from "./pages/NewCreateEditPost"
import Login from "./pages/Login"
import { useState } from "react"
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
