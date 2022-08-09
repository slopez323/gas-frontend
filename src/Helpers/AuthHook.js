import { useState, useEffect, createContext, useContext } from "react";
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authUpdate, setAuthUpdate] = useState();

  useEffect(() => {
    const loggedUser = getUserToken();
    setUser(loggedUser);
  }, [authUpdate]);

  useEffect(() => {
    const verify = async () => {
      const url = `${urlEndpoint}/users/validate-token`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          [process.env.REACT_APP_TOKEN_HEADER_KEY]: user,
        },
      });
      const responseJSON = await response.json();
      if (responseJSON.success) {
        setUserId(responseJSON.message);
        setIsAdmin(responseJSON.isAdmin);
      } else removeUserToken();
      setAuthUpdate(response);
      return responseJSON;
    };

    if (user) {
      verify();
    } else {
      setUserId();
      setIsAdmin(false);
    }
  }, [user]);

  const checkDetails = (username, password, confirm) => {
    if (username.length < 5) {
      return "Username must be at least 5 characters long.";
    }
    if (password !== confirm) {
      return "Passwords do not match.";
    }
    if (
      !/\d/.test(password) ||
      !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) ||
      !/[a-zA-Z]/.test(password) ||
      password.length < 8 ||
      password.includes(" ")
    ) {
      return "Password must be at least 8 characters long, must not include spaces and must include at least 1 letter, number and special character.";
    }
    return "";
  };

  const register = async (username, password) => {
    const userDetails = { username, password };
    const url = `${urlEndpoint}/users/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const responseJSON = await response.json();
    if (responseJSON.success) {
      setUserToken(responseJSON.token);
    }
    setAuthUpdate(response);
    return responseJSON;
  };

  const login = async (username, password) => {
    const userDetails = { username, password };
    const url = `${urlEndpoint}/users/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const responseJSON = await response.json();
    if (responseJSON.success) {
      setUserToken(responseJSON.token);
    }
    setAuthUpdate(response);
    return responseJSON;
  };

  const logout = () => {
    removeUserToken();
    setAuthUpdate("token removed");
    return true;
  };

  const deleteAccount = async () => {
    const url = `${urlEndpoint}/users/delete-user/${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const responseJSON = await response.json();
    removeUserToken();
    setAuthUpdate(response);
    return responseJSON;
  };

  const value = {
    userId,
    isAdmin,
    checkDetails,
    register,
    login,
    logout,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const setUserToken = (token) => {
  localStorage.setItem(
    process.env.REACT_APP_TOKEN_HEADER_KEY,
    JSON.stringify(token)
  );
};

const removeUserToken = () => {
  localStorage.removeItem(process.env.REACT_APP_TOKEN_HEADER_KEY);
  return true;
};

const getUserToken = () => {
  return JSON.parse(
    localStorage.getItem(process.env.REACT_APP_TOKEN_HEADER_KEY)
  );
};
