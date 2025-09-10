import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../utils/API_BASE";

// Helper to detect mobile device
function isMobileScreen() {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
  }
  return false;
}

const Logout = ({ setAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        // Optionally handle error
      } finally {
        // For mobile, clear localStorage tokens
        if (isMobileScreen()) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        setAuth({});
        navigate("/", { replace: true });
      }
    };
    logout();
  }, [navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-lg text-gray-700">Logging out...</div>
    </div>
  );
};

export default Logout;
