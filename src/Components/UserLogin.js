import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    const user = { username, password };
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/login`;
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
      <button
        onClick={() => {
          loginUser();
        }}
      >
        Log In
      </button>
    </>
  );
};

export default UserLogin;
