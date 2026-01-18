import "../css/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Profile({ open, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setIsVisible(true);

      const fetchProfile = async () => {
        setLoading(true);
        const key = localStorage.getItem("key");
        if (!key) {
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/profile?key=${key}`);
          const data = await res.json();
          if (data.success) setUser(data.body);
        } catch (err) {
          console.error("Profile fetch failed:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setLoading(true);
        setUser(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open]);
 
  useEffect(() => {
    if (!open) return;

    let fired = false;

    const close = () => {
      if (fired) return;
      fired = true;
      onClose();
    };

    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });

    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
    };
  }, [open, onClose]);

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    // navigate("/login");
    window.location.href = "/login"; // Force full reload to verify reset
  };

  if (!open && !isVisible) return null;

  return (
    <>
      <div className={`profile-backdrop ${open ? "fade-in" : "fade-out"}`} onClick={onClose}></div>

      <div className={`profile-popup-card ${open ? "slide-in" : "slide-out"}`}>
        {loading ? (
          <div className="profile-loading">Loading...</div>
        ) : (
          <>
            <div className="profile-header-card">
              <div className="profile-avatar">👤</div>
              <h2>{user?.name || "User"}</h2>
            </div>

            <div className="profile-balance-row">
              <div>
                <p className="balance-label">Current Balance</p>
                <h3 className="balance-amount">₹ {user?.balance ?? 0}</h3>
              </div>
              <button
                className="topup-btn"
                onClick={() => handleNavigation("/Topup")}
              >
                Top-Up
              </button>
            </div>

            <div className="profile-actions">
              <div
                className="action-card"
                onClick={() => handleNavigation("/order")}
                style={{ cursor: "pointer" }}
              >
                <div className="profile-action-icon">💲</div>
                Orders
              </div>
              <div
                className="action-card"
                onClick={() => handleNavigation("/contact")} 
                style={{ cursor: "pointer" }}
              >
                <div className="profile-action-icon">✉️</div>
                Contact Us
              </div>
            </div>

            <div className="profile-info">{user?.phone || "+91 XXXXXXXXXX"}</div>
            <div className="profile-info">{user?.email || "email@example.com"}</div>

            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
