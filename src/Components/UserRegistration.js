import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Helpers/AuthHook";

const UserRegistration = ({ setServerResponse }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const { checkDetails, register } = useAuth();
  const navigate = useNavigate();

  // const checkDetails = () => {
  //   if (username.length < 5) {
  //     setErrorMsg("Username must be at least 5 characters long.");
  //     return;
  //   }
  //   if (password !== confirm) {
  //     setErrorMsg("Passwords do not match.");
  //     return;
  //   }
  //   if (
  //     !/\d/.test(password) ||
  //     !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) ||
  //     !/[a-zA-Z]/.test(password) ||
  //     password.length < 8 ||
  //     password.includes(" ")
  //   ) {
  //     setErrorMsg(
  //       "Password must be at least 8 characters long, must not include spaces and must include at least 1 letter, number and special character."
  //     );
  //     return;
  //   }
  //   setErrorMsg("");
  // };

  // const registerUser = async () => {
  //   const user = { username, password };
  //   const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/register`;
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(user),
  //   });
  //   const responseJSON = await response.json();
  //   if (responseJSON.success) {
  //     localStorage.setItem(
  //       process.env.REACT_APP_TOKEN_HEADER_KEY,
  //       JSON.stringify(responseJSON.token)
  //     );
  //     navigate("/main");
  //   } else {
  //     setErrorMsg(responseJSON.message);
  //     setShowError(true);
  //   }
  //   setServerResponse(response);
  // };

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
      <input
        placeholder="Confirm Password"
        type="password"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        className="login-submit-btn"
        onClick={async () => {
          const error = await checkDetails(username, password, confirm);
          if (error === "") {
            setShowError(false);
            const registerResponse = await register(username, password);
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
        }}
      >
        Create Account
      </button>
      {showError && <p className="login-error">{errorMsg}</p>}
    </>
  );
};

export default UserRegistration;
