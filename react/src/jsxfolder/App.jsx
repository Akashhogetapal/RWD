import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Canteen from "./Canteen";
import PageTwo from "./PageTwo";
import Order from "./orderc"
import Landing from "./Landing";
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import Menu from "./Menu";
import Cart from "./Cart";
import Profile from "./profile";
import Topup from "./topup";
import Admin from "./admin";

import ProtectedRoute from "./ProtectedRoute";

// ... existing imports

function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <BrowserRouter>
      <Profile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/menu" element={
          <ProtectedRoute>
            <Menu onProfile={() => setProfileOpen(true)} />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/kitchen" element={
          <ProtectedRoute>
            <Canteen onProfile={() => setProfileOpen(true)} />
          </ProtectedRoute>
        } />
        <Route path="/pagetwo" element={
          <ProtectedRoute>
            <PageTwo />
          </ProtectedRoute>
        } />
        <Route path="/order" element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        } />
        <Route path="/topup" element={
          <ProtectedRoute>
            <Topup />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
