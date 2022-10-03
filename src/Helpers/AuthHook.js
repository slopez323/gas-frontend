import { useState, useEffect, createContext, useContext } from "react";
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authUpdate, setAuthUpdate] = useState();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const verify = async () => {
    setIsAuthLoading(true);
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
    setIsAuthLoading(false);
    return responseJSON;
  };

  useEffect(() => {
    const loggedUser = getUserToken();
    setUser(loggedUser);
  }, [authUpdate]);

  useEffect(() => {
    if (user) {
      verify();
    } else {
      setUserId();
      setIsAdmin(false);
    }
  }, [user]);

  const checkDetails = (email, username, password, confirm) => {
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Enter a valid email.";
      }
    }
    if (username && username.length < 5) {
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

  const register = async (email, username, password) => {
    setIsAuthLoading(true);
    const userDetails = { email, username, password };
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
    setIsAuthLoading(false);
    return responseJSON;
  };

  const login = async (username, password) => {
    setIsAuthLoading(true);
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
    setIsAuthLoading(false);
    return responseJSON;
  };

  const changePassword = async (password) => {
    setIsAuthLoading(true);
    const userDetails = { userId, password };
    const url = `${urlEndpoint}/users/change-password`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const responseJSON = await response.json();
    setAuthUpdate(response);
    setIsAuthLoading(false);
    return responseJSON;
  };

  const forgetPassword = async (email) => {
    setIsAuthLoading(true);
    const url = `${urlEndpoint}/users/forget-password`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const responseJSON = await response.json();
    setAuthUpdate(response);
    setIsAuthLoading(false);
    return responseJSON;
  };

  const logout = () => {
    removeUserToken();
    setAuthUpdate("token removed");
    return true;
  };

  const deleteAccount = async () => {
    setIsAuthLoading(true);
    const url = `${urlEndpoint}/users/delete-user/${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const responseJSON = await response.json();
    if (responseJSON.success) removeUserToken();
    setAuthUpdate(response);
    setIsAuthLoading(false);
    return responseJSON;
  };

  const value = {
    userId,
    isAdmin,
    checkDetails,
    register,
    login,
    logout,
    changePassword,
    forgetPassword,
    deleteAccount,
    isAuthLoading,
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
