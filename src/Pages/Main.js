import { useEffect, useState } from "react";
import logo from "../Assets/gblogo.png";
import { Outlet, useNavigate } from "react-router-dom";

const Main = () => {
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("gasUser");
    if (!loggedUser) {
      navigate("/");
    } else {
      setUserId(JSON.parse(loggedUser).id);
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/user/${userId}`;
      const response = await fetch(url);
      const responseJSON = await response.json();
      setUsername(responseJSON.username);
      setFavorites(responseJSON.favorites);
      setData(responseJSON.data);
    };
    if (userId) getUserData();
  }, [userId]);

  return (
    <div>
      <div className="user-view">
        <div className="header">
          <img src={logo} alt="logo" />
          <span>{username}</span>
        </div>
        <Outlet context={[userId, username]} />
      </div>
    </div>
  );
};

export default Main;
