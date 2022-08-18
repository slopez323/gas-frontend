import { useState } from "react";
import { useAuth } from "../Helpers/AuthHook";

const NewPassword = ({ setShowChangePass }) => {
  const { checkDetails, changePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState("");

  return (
    <div className="popup-container">
      <div className="popup confirm-popup">
        <input
          placeholder="New Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <div className="confirm-buttons">
          <button
            onClick={async () => {
              const error = await checkDetails("", "", password, confirm);
              if (error === "") {
                setShowError(false);
                const newPassResponse = await changePassword(password);
                if (newPassResponse.success) {
                  setErrorMsg(newPassResponse.message);
                  setTimeout(() => setShowChangePass(false), 1000);
                } else {
                  setErrorMsg(
                    newPassResponse.message ||
                      "Unable to change password.  Try again."
                  );
                }
              } else {
                setErrorMsg(error);
              }
              setShowError(true);
            }}
          >
            Submit
          </button>
          <button onClick={() => setShowChangePass(false)}>Cancel</button>
        </div>
        {showError && <p className="login-error">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default NewPassword;
