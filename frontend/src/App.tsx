import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"
import ProductPage from "./pages/Product"
import Dashboard from "./pages/Dashboard"
import SingleProduct from "./pages/SingleProduct"

function App() {


  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:id" element={<SingleProduct />} />
        <Route path="/all" element={<ProductPage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
