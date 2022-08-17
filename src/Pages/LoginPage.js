import { Outlet, useNavigate } from "react-router-dom";
import logo from "../Assets/myG-light.png";
import { useEffect, useState } from "react";
import { useAuth } from "../Helpers/AuthHook";
import Loading from "../Components/Loading";

const LoginPage = () => {
  const [loginOption, setLoginOption] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const { userId, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/main");
    } else navigate("/");
  }, [userId]);

  return (
    <div className="login-page">
      {(isLoading || isAuthLoading) && <Loading />}
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
          <Outlet context={[setIsLoading]} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
