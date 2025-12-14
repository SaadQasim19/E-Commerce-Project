import { Box, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CreatePage from "./Pages/CreatePage";
import HomePage from "./Pages/HomePage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrdersPage from "./Pages/OrdersPage";
import ContactUs from "./Pages/ContactUs";
import TrackOrder from "./Pages/TrackOrder";
import ShippingInfo from "./Pages/ShippingInfo";
import ReturnsExchanges from "./Pages/ReturnsExchanges";
import FAQs from "./Pages/FAQs";
import AboutUs from "./Pages/AboutUs";
import Careers from "./Pages/Careers";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import Blog from "./Pages/Blog";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import AuthCallbackPage from "./Pages/AuthCallbackPage";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminCustomers from "./Pages/Admin/AdminCustomers";
import AdminAnalytics from "./Pages/Admin/AdminAnalytics";
import AdminSettings from "./Pages/Admin/AdminSettings";
import AdminProfile from "./Pages/Admin/AdminProfile";
import UserProfile from "./Pages/UserProfile";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  console.log("App component rendered");
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/*"
        element={
          <Box minH={"100vh"} bg={useColorModeValue("gray.50", "gray.900")} display="flex" flexDirection="column">
            <Navbar />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                
                {/* User Profile */}
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/account" element={<UserProfile />} />
                
                {/* Info Pages */}
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />
                <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        }
      />

      {/* Admin Routes - Protected */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}

export default App;