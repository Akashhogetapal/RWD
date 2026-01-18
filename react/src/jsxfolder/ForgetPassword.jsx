import "../css/forget.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPopup from "./AuthPopup";
import { API_BASE_URL } from "../config";

function ForgetPassword() {
    const navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [popup, setPopup] = useState(null); 

    const inputRef = useRef(null);


    useEffect(() => {
        document.body.style.overflow = "auto";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);


    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isValidPhone = (val) => /^[0-9]{10}$/.test(val);


    const handleSendOTP = async () => {
        const val = email.trim();

        if (!isValidEmail(val) && !isValidPhone(val)) {
            triggerError(inputRef.current);
            setPopup({ title: "Input Error", message: "Please enter a valid email or phone number.", icon: "⚠️" });
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forget`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: val }),
            });
            const data = await res.json();

            if (res.status === 200 && data.success) {
                setOtpSent(true);
                setPopup({ title: "OTP Sent", message: "Verification code sent successfully!", icon: "📩", btnText: "Okay" });
            } else {
                triggerError(inputRef.current);
                setPopup({ title: "Failed", message: data.message || "Failed to send OTP.", icon: "❌" });
            }
        } catch (error) {
            console.error("Error:", error);
            setPopup({ title: "Server Error", message: "Something went wrong.", icon: "❌" });
        }
    };


    const handleVerifyOTP = async () => {
        const otpValue = otp.join("").trim();
        if (otpValue.length !== 6) {
            setPopup({ title: "Invalid Input", message: "Please enter the complete 6-digit code.", icon: "⚠️" });
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpValue }),
            });
            const data = await res.json();

            if (res.status === 200 && data.success) {
                localStorage.setItem("resetEmail", email);
                navigate("/reset");
            } else {
                setPopup({ title: "Verification Failed", message: "Invalid OTP. Please try again.", icon: "❌" });
                setOtp(["", "", "", "", "", ""]);
            }
        } catch (err) {
            console.error(err);
            setPopup({ title: "Server Error", message: "Verification Failed.", icon: "❌" });
        }
    };


    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const triggerError = (el) => {
        if (el) {
            el.classList.add("error");
            setTimeout(() => el.classList.remove("error"), 300);
            el.focus();
        }
    };

    return (
        <div className="card">

            { }
            <div onClick={() => navigate("/login")} className="back-link">
                ← Back to Login
            </div>

            <h1>Forgot Password</h1>
            <p className="desc-text">
                Enter your registered email or phone number to receive a verification code.
            </p>

            { }
            <div className="input-group">
                <label className="input-label">Email Address or Phone Number</label>
                <input
                    type="text"
                    ref={inputRef}
                    className={otpSent ? "input-success" : ""}
                    placeholder="Enter email or phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                />

                <button className="btn-get-otp" onClick={handleSendOTP}>
                    {otpSent ? "Resend OTP" : "Get OTP"}
                </button>
            </div>

            { }
            <div className={`otp-section ${otpSent ? "visible" : ""}`}>

                <div className="divider">VERIFY</div>

                <div className="input-group">
                    <label className="input-label">Enter the 6-Digit Verification Code</label>
                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                className="otp-box"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>
                </div>

                <button className="btn-verify" onClick={handleVerifyOTP}>
                    Verify & Proceed
                </button>
            </div>

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

export default ForgetPassword;