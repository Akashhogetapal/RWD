import { Navigate } from "react-router-dom";
import { useState } from "react";
import AuthPopup from "./AuthPopup";

function ProtectedRoute({ children }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const key = localStorage.getItem("key");

    if (!key) {
        if (shouldRedirect) {
            return <Navigate to="/login" replace />;
        }
        return <AuthPopup onConfirm={() => setShouldRedirect(true)} />;
    }

    return children;
}

export default ProtectedRoute;
