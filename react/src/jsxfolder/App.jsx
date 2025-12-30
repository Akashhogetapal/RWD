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
        <Route path="/menu" element={<Menu onProfile={() => setProfileOpen(true)} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/kitchen" element={<Canteen onProfile={() => setProfileOpen(true)} />} />
        <Route path="/pagetwo" element={<PageTwo />} />
        <Route path="/order" element={<Order />} />
        <Route path="/topup" element={<Topup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
