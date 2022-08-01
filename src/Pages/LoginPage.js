import { Outlet, useNavigate } from "react-router-dom";
import logo from "../Assets/gblogo.png";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("gasUser");
    if (user) {
      navigate("/main");
    }
  }, []);

  return (
    <div className="login-page">
      <img src={logo} alt="logo" />
      <div className="auth">
        <div className="auth-options">
          <div onClick={() => navigate("/register")}>Register</div>
          <div onClick={() => navigate("/")}>Sign In</div>
        </div>
        <div className="auth-details">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
