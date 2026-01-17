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
                navigate("/shopdashboardd");
            } else {
                setPopup({ title: "Login Failed", message: result.message, icon: "❌" });
            }
        } catch (err) {
            console.error(err);
            setPopup({ title: "Error", message: "Server error", icon: "❌" });
        }
    };

    return (
        <div className="login-page-wrapper" style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #FFFFFF, #FFE0B2)' }}>
            <div className="form-container" style={{ maxWidth: '400px', width: '100%', padding: '40px', borderRadius: '15px' }}>
                <h2 className="form-title" style={{ textAlign: 'center',marginBottom:'90px', height: '74px', width: '440px',borderRadius:'100px',display:'flex',alignItems:'center',justifyContent:'center',background: 'linear-gradient(to right, #FF7043, #FF9776)',color:'white',fontWeight:'600' }}>SHOP KEEPER LOGIN</h2>

                <div className="input-box">
                    <label style={{fontWeight:'400',fontSize:'15px',marginLeft:'30px'}} className="input-label">Shopkeeper's Email ID</label>
                    <input
                        style={{border:'2px solid #FF5722cd',width:'400px',borderRadius:'16px',background:'none',marginLeft:'22px'}}
                        className="custom-input"
                        type="email"
                        placeholder="shop@college.edu"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                </div>

                <div className="input-box">
                    <label style={{fontWeight:'400',fontSize:'15px',marginLeft:'30px'}} className="input-label">Password</label>
                    <input
                        style={{border:'2px solid #ff5622cd',width:'400px',borderRadius:'16px',background:'none',marginLeft:'22px',marginBottom:'120px'}}
                        className="custom-input"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                </div>

                <button style={{background: 'linear-gradient(360deg, #FF7043, #FF9776)',width:'250px',height:'65px',marginLeft:'90px'}} className="submit-btn" onClick={handleLogin}>Log In</button>
            </div>
            {popup && <AuthPopup {...popup} onConfirm={() => setPopup(null)} btnText="Dismiss" />}
        </div>
    );
}

export default ShopLogin;
