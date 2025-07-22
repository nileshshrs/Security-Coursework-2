import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import SingleProduct from "./pages/SingleProduct";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import DashboardClothes from "./components/dashboard/DashboardClothes";
import DashboardUsers from "./components/dashboard/DashboardUsers";
import DashboardOrders from "./components/dashboard/DashboardOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MfaPage from "./pages/MfaPage";
import CheckoutPage from "./pages/Checkout";
import AccountPage from "./pages/Account";
import Mens from "./pages/Mens";
import Womens from "./pages/Womens";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide Navigation if path starts with "/dashboard"
  const hideNav = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNav && <Navigation />}
      <Routes>
        {/* Public routes (no auth required) */}
        <Route path="/" element={<Home />} />
        <Route path="/clothes/:id" element={<SingleProduct />} />
        <Route path="/clothes/all" element={<ProductPage />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/email-verification/:code" element={<VerifyEmailPage />} /> {/* ✅ NEW ROUTE */}

        {/* Guest-only routes */}
        <Route path="/sign-in" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/sign-up" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/account-recovery" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route path="/verify-mfa" element={user ? <Navigate to="/" replace /> : <MfaPage />} />
        <Route path="/password/reset" element={user ? <Navigate to="/" replace /> : <ResetPassword />} />

        {/* Protected user routes */}
        <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/sign-in" replace />} />
        <Route path="/account" element={user ? <AccountPage /> : <Navigate to="/sign-in" replace />} />

        {/* Admin-only dashboard */}
        <Route
          path="/dashboard/*"
          element={
            user && user.role === "admin"
              ? <Dashboard />
              : <Navigate to="/" replace />
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="clothes" element={<DashboardClothes />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="orders" element={<DashboardOrders />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
