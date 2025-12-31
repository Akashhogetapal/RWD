import "../css/login.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthPopup from "./AuthPopup";

function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [popup, setPopup] = useState(null);
    const [showPass, setShowPass] = useState(false);


    const [showSignupPass, setShowSignupPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
        fullname: "", phone: "", email: "", roll: "", gender: "", campus: "", password: "", confirmpass: ""
    });


    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const sNameRef = useRef(null);
    const sPhoneRef = useRef(null);
    const sEmailRef = useRef(null);
    const sRollRef = useRef(null);
    const sCampusRef = useRef(null);
    const sGenderRef = useRef(null);
    const sPassRef = useRef(null);
    const sConfirmRef = useRef(null);


    const triggerErrorAnimation = (ref, placeholderMsg) => {
        if (ref.current) {
            ref.current.classList.remove("error");
            void ref.current.offsetWidth;
            ref.current.classList.add("error");
            if (placeholderMsg) ref.current.placeholder = placeholderMsg;
            ref.current.focus();
        }
    };


    const handleLogin = async () => {
        const email = loginData.email.trim();
        const password = loginData.password.trim();

        if (!email) { triggerErrorAnimation(emailRef, "Email Required"); return; }
        if (!password) { triggerErrorAnimation(passwordRef, "Password Required"); return; }

        try {
            const res = await fetch("https://rwd.up.railway.app/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.status === 200 && data.success) {
                console.log("Login Success:", data);
                localStorage.setItem("token", data.jwtToke);
                localStorage.setItem("gmail", email);
                localStorage.setItem("key", data.key);
                setPopup({
                    title: "Welcome Back! 👋",
                    message: "Login successful.",
                    icon: "✅",
                    btnText: "Continue",
                    onConfirm: () => navigate("/menu")
                });
            } else if (res.status === 409) {
                if (data.type === "email") {
                    setLoginData(prev => ({ ...prev, email: "" }));
                    triggerErrorAnimation(emailRef, "User doesn't exist");
                } else if (data.type === "pass") {
                    setLoginData(prev => ({ ...prev, password: "" }));
                    triggerErrorAnimation(passwordRef, "Invalid Password");
                }
            } else {
                triggerErrorAnimation(emailRef, "Login Failed");
                triggerErrorAnimation(passwordRef, "Login Failed");
            }
        } catch (err) {
            console.error(err);
            setPopup({
                title: "Error",
                message: "Server error. Please try again later.",
                icon: "❌",
                btnText: "Dismiss"
            });
        }
    };


    const handleSignup = async () => {
        let hasError = false;
        const { fullname, phone, email, roll, gender, campus, password, confirmpass } = signupData;


        if (!fullname.trim()) { triggerErrorAnimation(sNameRef, "Name required"); hasError = true; }
        if (!phone.trim()) { triggerErrorAnimation(sPhoneRef, "Phone required"); hasError = true; }
        if (!email.trim()) { triggerErrorAnimation(sEmailRef, "Email required"); hasError = true; }
        if (!roll.trim()) { triggerErrorAnimation(sRollRef, "USN required"); hasError = true; }
        if (!gender) { triggerErrorAnimation(sGenderRef); hasError = true; }
        if (!campus.trim()) { triggerErrorAnimation(sCampusRef, "Campus required"); hasError = true; }
        if (!password.trim()) { triggerErrorAnimation(sPassRef, "Password required"); hasError = true; }
        if (!confirmpass.trim()) { triggerErrorAnimation(sConfirmRef, "Confirm password"); hasError = true; }

        if (hasError) return;


        const nameregex = /^[A-Za-z ]+$/;
        if (!nameregex.test(fullname.trim())) {
            setSignupData(p => ({ ...p, fullname: "" }));
            triggerErrorAnimation(sNameRef, "Invalid Name (Letters only)");
            return;
        }

        const phonereg = /^[0-9]+$/;
        if (!phonereg.test(phone.trim())) {
            setSignupData(p => ({ ...p, phone: "" }));
            triggerErrorAnimation(sPhoneRef, "Invalid Number");
            return;
        }

        if (!email.includes("@")) {
            setSignupData(p => ({ ...p, email: "" }));
            triggerErrorAnimation(sEmailRef, "Invalid Email");
            return;
        }

        if (campus.trim().toLowerCase() !== "ait campus") {
            setSignupData(p => ({ ...p, campus: "" }));
            triggerErrorAnimation(sCampusRef, "Only 'AIT Campus' allowed");
            return;
        }

        const strongPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPass.test(password.trim())) {
            setSignupData(p => ({ ...p, password: "" }));
            triggerErrorAnimation(sPassRef, "Weak: Needs Upper, Lower, Number, Special");
            return;
        }

        if (password !== confirmpass) {
            setSignupData(p => ({ ...p, confirmpass: "" }));
            triggerErrorAnimation(sConfirmRef, "Passwords do not match");
            return;
        }


        const bodydata = {
            name: fullname.trim(),
            phone: phone.trim(),
            email: email.trim(),
            usn: roll.trim(),
            gender: gender,
            campus: campus.trim(),
            password: password
        };

        try {
            const res = await fetch("https://rwd.up.railway.app/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodydata)
            });

            const data = await res.json();

            if (res.status === 201 && data.success) {
                setPopup({
                    title: "Success",
                    message: "Account Created Successfully! Please Log In.",
                    icon: "🎉",
                    btnText: "Go to Login",
                    onConfirm: () => setActiveTab("login")
                });
            } else {
                if (data.type === "email") {
                    setSignupData(p => ({ ...p, email: "" }));
                    triggerErrorAnimation(sEmailRef, "Email already exists");
                } else if (data.type === "usn") {
                    setSignupData(p => ({ ...p, roll: "" }));
                    triggerErrorAnimation(sRollRef, "USN already exists");
                } else if (data.type === "missing") {
                    setPopup({
                        title: "Missing Fields",
                        message: "Please fill all required fields",
                        icon: "⚠️",
                        btnText: "Fix"
                    });
                } else {
                    setPopup({
                        title: "Signup Failed",
                        message: data.message || "Server error",
                        icon: "❌",
                        btnText: "Retry"
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setPopup({
                title: "Error",
                message: "Server Error. Please try again later.",
                icon: "❌",
                btnText: "Dismiss"
            });
        }
    };



    return (
        <div className="login-page-wrapper">

            { }
            <div className="login-left">

                { }
                <div className="toggle-container">
                    <button
                        className={`toggle-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Log In
                    </button>
                    <button
                        className={`toggle-btn ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="form-container">
                    { }
                    {activeTab === 'login' && (
                        <>
                            <h2 className="form-title">Welcome back!</h2>

                            <div className="input-box">
                                <label className="input-label">College Email ID</label>
                                <input
                                    ref={emailRef}
                                    className="custom-input"
                                    type="email"
                                    placeholder="your.email@college.edu"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </div>

                            <div className="input-box">
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        ref={passwordRef}
                                        className="custom-input"
                                        type={showPass ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    />
                                    <span
                                        onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', color: '#888', fontSize: '20px' }}
                                    >
                                        {showPass ? "🙈" : "👁️"}
                                    </span>
                                </div>
                            </div>

                            <div className="forgot-text">
                                { }
                                <span onClick={() => navigate("/forget")} style={{ cursor: "pointer" }}>
                                    Forgot Password?
                                </span>
                            </div>

                            <button className="submit-btn" onClick={handleLogin}>Log In</button>

                            <p className="switch-bottom">
                                Don't have an account? <span onClick={() => setActiveTab('signup')}>Sign Up</span>
                            </p>
                        </>
                    )}

                    {/* SIGNUP FORM */}
                    {activeTab === 'signup' && (
                        <>
                            <h2 className="form-title">Create student profile</h2>

                            <div className="grid-row">
                                <div className="input-box">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        ref={sNameRef}
                                        className="custom-input" type="text" placeholder="John Doe"
                                        value={signupData.fullname} onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                                    />
                                </div>
                                <div className="input-box">
                                    <label className="input-label">Phone Number</label>
                                    <input
                                        ref={sPhoneRef}
                                        className="custom-input" type="tel" placeholder="0123456789"
                                        value={signupData.phone} onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="input-box">
                                    <label className="input-label">College Email ID</label>
                                    <input
                                        ref={sEmailRef}
                                        className="custom-input" type="email" placeholder="email@college.edu"
                                        value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    />
                                </div>
                                <div className="input-box">
                                    <label className="input-label">Student Roll No</label>
                                    <input
                                        ref={sRollRef}
                                        className="custom-input" type="text" placeholder="STU123"
                                        value={signupData.roll} onChange={(e) => setSignupData({ ...signupData, roll: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="input-box">
                                    <label className="input-label">Gender</label>
                                    <select
                                        ref={sGenderRef}
                                        className="custom-input" value={signupData.gender} onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="input-box">
                                    <label className="input-label">Campus Name</label>
                                    <input
                                        ref={sCampusRef}
                                        className="custom-input" type="text" placeholder="AIT Campus"
                                        value={signupData.campus} onChange={(e) => setSignupData({ ...signupData, campus: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="input-box">
                                    <label className="input-label">Create Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            ref={sPassRef}
                                            className="custom-input" type={showSignupPass ? "text" : "password"} placeholder="Min 8 chars"
                                            value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        />
                                        <span onClick={() => setShowSignupPass(!showSignupPass)} style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', color: '#888', fontSize: '20px' }}>
                                            {showSignupPass ? "🙈" : "👁️"}
                                        </span>
                                    </div>
                                </div>
                                <div className="input-box">
                                    <label className="input-label">Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            ref={sConfirmRef}
                                            className="custom-input" type={showConfirmPass ? "text" : "password"} placeholder="Re-enter"
                                            value={signupData.confirmpass} onChange={(e) => setSignupData({ ...signupData, confirmpass: e.target.value })}
                                        />
                                        <span onClick={() => setShowConfirmPass(!showConfirmPass)} style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', color: '#888', fontSize: '20px' }}>
                                            {showConfirmPass ? "🙈" : "👁️"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="submit-btn" style={{ marginTop: '15px' }} onClick={handleSignup}>Register Account</button>

                            <p className="switch-bottom">
                                Already have an account? <span onClick={() => setActiveTab('login')}>Log In</span>
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: IMAGE OVERLAY */}
            <div className="login-right">
                <div className="login-overlay">
                    {activeTab === 'login' ? (
                        <>
                            <div className="clock-icon">🕒</div>
                            <div className="overlay-title">Ready to order?</div>
                            <div className="overlay-desc">
                                Your favorite meals are<br />
                                just a few clicks away.<br />
                                Skip the queue today.
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="overlay-title" style={{ textAlign: 'left', marginBottom: '30px' }}>Why Register?</div>
                            <ul className="features-list">
                                <li>Track Orders Live</li>
                                <li>Exclusive Discounts</li>
                                <li>Fast Checkout</li>
                                <li>Pre-schedule Meals</li>
                                <li>Save Payment Methods</li>
                            </ul>
                            <div style={{ marginTop: '50px', fontSize: '24px', fontWeight: '700' }}>Join 2000+ Students</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup */}
            {popup && (
                <AuthPopup
                    title={popup.title}
                    message={popup.message}
                    icon={popup.icon}
                    btnText={popup.btnText}
                    onConfirm={() => {
                        if (popup.onConfirm) popup.onConfirm();
                        setPopup(null);
                    }}
                />
            )}

        </div>
    );
}

export default Login;