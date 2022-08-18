import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../Helpers/AuthHook";

const ForgotPass = () => {
  const [setIsLoading] = useOutletContext();
  const { forgetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <div>
        Enter the email address associated with your account and a new temporary
        password will be sent to you.
      </div>
      <input
        placeholder="Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        id="forget-submit"
        onClick={async () => {
          setIsLoading(true);
          const forgetResponse = await forgetPassword(email);
          if (forgetResponse.message) {
            setErrorMsg(forgetResponse.message);
          } else {
            setErrorMsg("Unknown Error.  Try again.");
          }
          setShowError(true);
          setIsLoading(false);
        }}
      >
        Submit
      </button>
      {showError && <p className="login-error">{errorMsg}</p>}
      <p className="auth-p" onClick={() => navigate("/")}>
        ← Back to Login
      </p>
    </>
  );
};

export default ForgotPass;
