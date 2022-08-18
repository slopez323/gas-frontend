import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../Helpers/AuthHook";

const UserRegistration = () => {
  const [setIsLoading] = useOutletContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const { checkDetails, register } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <input
        placeholder="Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Confirm Password"
        type="password"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        className="login-submit-btn"
        onClick={async () => {
          setIsLoading(true);
          const error = await checkDetails(email, username, password, confirm);
          if (error === "") {
            setShowError(false);
            const registerResponse = await register(email, username, password);
            if (registerResponse.success) {
              navigate("/main");
            } else {
              setErrorMsg(registerResponse.message);
              setShowError(true);
            }
          } else {
            setErrorMsg(error);
            setShowError(true);
          }
          setIsLoading(false);
        }}
      >
        Create Account
      </button>
      {showError && <p className="login-error">{errorMsg}</p>}
    </>
  );
};

export default UserRegistration;
