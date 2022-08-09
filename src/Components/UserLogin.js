import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Helpers/AuthHook";

const UserLogin = ({ setServerResponse }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="login-submit-btn"
        onClick={async () => {
          const loginResponse = await login(username, password);
          if (loginResponse.success) {
            navigate("/main");
          } else {
            setErrorMsg(loginResponse.message);
            setShowError(true);
          }
        }}
      >
        Log In
      </button>
      {showError && <p className="login-error">{errorMsg}</p>}
    </>
  );
};

export default UserLogin;
