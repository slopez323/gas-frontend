import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const checkDetails = () => {
    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (
      !/\d/.test(password) ||
      !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) ||
      !/[a-zA-Z]/.test(password) ||
      password.length < 8 ||
      password.includes(" ")
    ) {
      setErrorMsg(
        "Password must be at least 8 characters long, must not include spaces and must include at least 1 letter, number and special character."
      );
      return;
    }
    setErrorMsg("");
  };

  const registerUser = async () => {
    const user = { username, password };
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const responseJSON = await response.json();
    const { id, token } = responseJSON;
    if (responseJSON.success) {
      localStorage.setItem("gasUser", JSON.stringify({ id, token }));
      navigate("/main");
    } else {
      setErrorMsg(responseJSON.message);
      setShowError(true);
    }
  };

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
        onClick={() => {
          checkDetails();
          if (errorMsg === "") {
            setShowError(false);
            registerUser();
          } else {
            setShowError(true);
          }
        }}
      >
        Create Account
      </button>
      {showError && <p>{errorMsg}</p>}
    </>
  );
};

export default UserRegistration;
