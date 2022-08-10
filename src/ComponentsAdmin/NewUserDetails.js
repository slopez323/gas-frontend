import { useState } from "react";
import { useAuth } from "../Helpers/AuthHook";

const NewUserDetails = ({ setUpdateList, setShowCreateNew }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [access, setAccess] = useState("user");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { checkDetails } = useAuth();

  const register = async (username, password, access) => {
    const userDetails = { username, password, access };
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/admin/create-user`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const responseJSON = await response.json();
    setUpdateList(response);
    return responseJSON;
  };

  return (
    <div className="popup-container">
      <div className="popup new-user-popup">
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
        <select value={access} onChange={(e) => setAccess(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button
          style={{ fontWeight: "bold" }}
          className="admin-buttons"
          onClick={async () => {
            const error = await checkDetails(username, password, confirm);
            if (error === "") {
              setShowError(false);
              const registerResponse = await register(
                username,
                password,
                access
              );
              if (registerResponse.success) {
                setShowCreateNew(false);
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
        <button
          className="admin-buttons"
          onClick={() => setShowCreateNew(false)}
        >
          Cancel
        </button>
        {showError && <p className="login-error">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default NewUserDetails;
