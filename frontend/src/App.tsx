import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import SingleProduct from "./pages/SingleProduct";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import DashboardClothes from "./components/dashboard/DashboardClothes"; // <-- Import

function App() {
  const location = useLocation();
  // Hide Navigation if path starts with "/dashboard"
  const hideNav = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          {/* These routes render inside Dashboard's <Outlet /> */}
          <Route index element={<DashboardOverview />} /> {/* /dashboard main overview */}
          <Route path="clothes" element={<DashboardClothes />} /> {/* /dashboard/clothes */}
          {/* Add more dashboard subpages here if needed */}
        </Route>
        <Route path="/:id" element={<SingleProduct />} />
        <Route path="/all" element={<ProductPage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
