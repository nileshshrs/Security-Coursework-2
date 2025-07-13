import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";
import Dashboard from "./pages/Dashboard"; // This is your layout with sidebar + <Outlet />
import SingleProduct from "./pages/SingleProduct";
import DashboardOverview from "./components/dashboard/DashboardOverview";
// import ClothesPage, UsersPage, OrdersPage etc as needed

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
          {/* The below routes render inside Dashboard's <Outlet /> */}
          <Route index element={<DashboardOverview />} /> {/* /dashboard main overview */}
          {/* More dashboard subpages can go here: */}
          {/* <Route path="clothes" element={<ClothesPage />} /> */}
          {/* <Route path="users" element={<UsersPage />} /> */}
          {/* <Route path="orders" element={<OrdersPage />} /> */}
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
