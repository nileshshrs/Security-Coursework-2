import { Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {


  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
