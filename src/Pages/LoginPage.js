import { Outlet, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth">
      <div className="auth-options">
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/")}>Sign In</button>
      </div>
      <div className="auth-details">
        <Outlet />
      </div>
    </div>
  );
};

export default LoginPage;
