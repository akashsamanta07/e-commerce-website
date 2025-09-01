import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../utils/API_BASE";

const Logout = ({setAuth}) => {
  console.log(1234)
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
        setAuth({});
        navigate("/my-account", { replace: true });
      }
    };
    logout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-lg text-gray-700">Logging out...</div>
    </div>
  );
};

export default Logout;
