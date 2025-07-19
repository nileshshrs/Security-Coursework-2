import { Route, Routes, useLocation, Navigate } from "react-router-dom";
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
import DashboardOrders from "./components/dashboard/DashboardOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MfaPage from "./pages/MfaPage";
import CheckoutPage from "./pages/Checkout";
import AccountPage from "./pages/Account";
import Mens from "./pages/Mens";
import Womens from "./pages/Womens";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide Navigation if path starts with "/dashboard"
  const hideNav = location.pathname.startsWith("/dashboard");

  // --- Route Guards ---
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/sign-in" replace />;
    return <>{children}</>;
  };

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || user.role !== "admin") return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    if (user) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <>
      {!hideNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clothes/:id" element={<SingleProduct />} />
        <Route path="/clothes/all" element={<ProductPage />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />

        {/* Guest-only pages */}
        <Route path="/sign-in" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
        <Route path="/sign-up" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
        <Route path="/account-recovery" element={<GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute>} />
        <Route path="/verify-mfa" element={<GuestOnlyRoute><MfaPage /></GuestOnlyRoute>} />
        <Route path="/password/reset" element={<GuestOnlyRoute><ResetPassword /></GuestOnlyRoute>} />

        {/* Authenticated user pages */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

        {/* Admin-only dashboard */}
        <Route path="/dashboard/*" element={<AdminRoute><Dashboard /></AdminRoute>}>
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
