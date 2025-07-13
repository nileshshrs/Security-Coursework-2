import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import SingleProduct from "./pages/SingleProduct";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import DashboardClothes from "./components/dashboard/DashboardClothes";
import DashboardUsers from "./components/dashboard/DashboardUsers";
import DashboardOrders from "./components/dashboard/DashboardOrders"; // <-- Import
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
          {/* Dashboard nested routes (rendered in <Outlet />) */}
          <Route index element={<DashboardOverview />} />
          <Route path="clothes" element={<DashboardClothes />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="orders" element={<DashboardOrders />} /> {/* /dashboard/orders */}
        </Route>
        <Route path="/clothes/:id" element={<SingleProduct />} />
        <Route path="/clothes/all" element={<ProductPage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/account-recovery" element={<ForgotPassword />} />
         <Route path="/password/reset" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
