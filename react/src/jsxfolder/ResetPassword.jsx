import "../css/pass.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPopup from "./AuthPopup";

function ResetPassword() {
    const navigate = useNavigate();
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [email, setEmail] = useState("");
    const [popup, setPopup] = useState(null); // { title, message, icon, btnText, onConfirm }

    useEffect(() => {
        const storedEmail = localStorage.getItem("resetEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setPopup({
                title: "Session Expired",
                message: "Please verify your email again.",
                icon: "⏰",
                btnText: "Verify Again",
                onConfirm: () => navigate("/forget")
            });
        }

        document.body.style.overflow = "auto";
    }, [navigate]);

    const handleReset = async () => {
        if (!pass1 || !pass2) {
            setPopup({ title: "Incomplete", message: "Please fill in both password fields.", icon: "⚠️" });
            return;
        }
        if (pass1 !== pass2) {
            setPopup({ title: "Mismatch", message: "Passwords do not match.", icon: "⚠️" });
            return;
        }

        try {
            const res = await fetch("https://rwd.up.railway.app/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    newPassword: pass1,
                    confirmPassword: pass2
                })
            });
            const data = await res.json();

            if (res.status === 200 && data.success) {
                setPopup({
                    title: "Success! 🎉",
                    message: "Password reset successfully! Login now.",
                    icon: "✅",
                    btnText: "Go to Login",
                    onConfirm: () => {
                        localStorage.removeItem("resetEmail");
                        navigate("/login");
                    }
                });
            } else {
                setPopup({
                    title: "Error",
                    message: data.message || "Something went wrong.",
                    icon: "❌"
                });
            }
        } catch (err) {
            console.error(err);
            setPopup({ title: "Server Error", message: "Please try again.", icon: "❌" });
        }
    };

    return (
        <div className="card">
            <h1>Reset Password</h1>
            <p className="subtitle">
                Your identity has been verified. Create a new password to secure your account.
            </p>

            <div className="form-group">
                <label htmlFor="pass1">New Password</label>
                <div className="input-wrapper">
                    <input
                        id="pass1"
                        type={showPass1 ? "text" : "password"}
                        placeholder="Enter new password"
                        value={pass1}
                        onChange={(e) => setPass1(e.target.value)}
                    />
                    <span className="eye-icon" onClick={() => setShowPass1(!showPass1)}>
                        {showPass1 ? "🙈" : "👁️"}
                    </span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="pass2">Confirm Password</label>
                <div className="input-wrapper">
                    <input
                        id="pass2"
                        type={showPass2 ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={pass2}
                        onChange={(e) => setPass2(e.target.value)}
                    />
                    <span className="eye-icon" onClick={() => setShowPass2(!showPass2)}>
                        {showPass2 ? "🙈" : "👁️"}
                    </span>
                </div>
            </div>

            <button className="btn-save" onClick={handleReset}>
                Save New Password
            </button>

            {/* Popup */}
            {popup && (
                <AuthPopup
                    title={popup.title}
                    message={popup.message}
                    icon={popup.icon}
                    btnText={popup.btnText || "OK"}
                    onConfirm={() => {
                        if (popup.onConfirm) popup.onConfirm();
                        setPopup(null);
                    }}
                />
            )}
        </div>
    );
}

export default ResetPassword;