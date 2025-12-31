import "../css/popup.css";
import { createPortal } from "react-dom";

function AuthPopup({
    title = "Authentication Required",
    message = "Missing details! Please log in to access this feature.",
    icon = "🔒",
    btnText = "Log In",
    onConfirm
}) {
    return createPortal(
        <div className="popup-overlay">
            <div className="popup-card">
                <div className="popup-icon">{icon}</div>
                <h3 className="popup-title">{title}</h3>
                <p className="popup-message">{message}</p>
                <button className="popup-btn" onClick={onConfirm}>
                    {btnText}
                </button>
            </div>
        </div>,
        document.body
    );
}

export default AuthPopup;


