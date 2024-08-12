import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      navigate("/requests");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default LoginSuccess;
