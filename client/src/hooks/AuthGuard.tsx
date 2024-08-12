import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/v1/auth/validate`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          navigate("/requests");
        } catch (error) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
