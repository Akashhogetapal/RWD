import "../css/login.css"; // Reusing login css
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import AuthPopup from "./AuthPopup";

function ShopLogin() {
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" });
    const [popup, setPopup] = useState(null);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/shop/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                localStorage.setItem("shopToken", "dummy_token"); // For now
                localStorage.setItem("kitchenName", result.kitchenName);
                localStorage.setItem("shopUser", result.name);
                navigate("/shop/dashboard");
            } else {
                setPopup({ title: "Login Failed", message: result.message, icon: "❌" });
            }
        } catch (err) {
            console.error(err);
            setPopup({ title: "Error", message: "Server error", icon: "❌" });
        }
    };

    return (
        <div className="login-page-wrapper" style={{ justifyContent: 'center' }}>
            <div className="form-container" style={{ maxWidth: '400px', width: '100%', padding: '40px', background: 'white', borderRadius: '15px' }}>
                <h2 className="form-title" style={{ textAlign: 'center' }}>Shopkeeper Portal</h2>

                <div className="input-box">
                    <label className="input-label">Shop Email</label>
                    <input
                        className="custom-input"
                        type="email"
                        placeholder="shop@college.edu"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                </div>

                <div className="input-box">
                    <label className="input-label">Password</label>
                    <input
                        className="custom-input"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                </div>

                <button className="submit-btn" onClick={handleLogin}>Log In</button>
            </div>
            {popup && <AuthPopup {...popup} onConfirm={() => setPopup(null)} btnText="Dismiss" />}
        </div>
    );
}

export default ShopLogin;
