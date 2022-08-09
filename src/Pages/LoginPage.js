import { Outlet, useNavigate } from "react-router-dom";
import logo from "../Assets/myG-light.png";
import { useEffect, useState } from "react";
import { useAuth } from "../Helpers/AuthHook";

const LoginPage = () => {
  const [loginOption, setLoginOption] = useState("login");

  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/main");
    } else navigate("/");
  }, [userId]);

  return (
    <div className="login-page">
      <img src={logo} alt="logo" />
      <div className="auth">
        <div className="auth-options">
          <button
            className={loginOption === "register" ? "login-select" : ""}
            onClick={() => {
              setLoginOption("register");
              navigate("/register");
            }}
          >
            Register
          </button>
          <button
            className={loginOption === "login" ? "login-select" : ""}
            onClick={() => {
              setLoginOption("login");
              navigate("/");
            }}
          >
            Sign In
          </button>
        </div>
        <div className="auth-details">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
