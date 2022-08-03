import { useEffect, useState } from "react";
import logo from "../Assets/gblogo.png";
import { Outlet, useNavigate } from "react-router-dom";

const Main = () => {
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState("");
  const [priceToUpdate, setPriceToUpdate] = useState();
  const [favorites, setFavorites] = useState([]);
  const [userLog, setUserLog] = useState([]);
  const [updateUserData, setUpdateUserData] = useState();
  const [priceReload, setPriceReload] = useState();
  const navigate = useNavigate();

  const fetchPrices = async (placeId) => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/station/${placeId}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    // if (responseJSON.success && !responseJSON.no_prices)
    //   setPrices(responseJSON.message);
    return responseJSON;
  };

  const updatePrice = async (price, type, method, placeId, name, vicinity) => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/update-price`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        type,
        method,
        placeId,
        name,
        vicinity,
        username,
      }),
    });
    const responseJSON = response.json();
    setPriceReload(response);
    setUpdateUserData(response);
  };

  const addToFav = async (placeId, name, vicinity) => {
    //add to user db fav
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/add-fav`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, placeId, name, vicinity }),
    });
    const responseJSON = response.json();
    setUpdateUserData(response);
  };

  const removeFav = async (placeId, name, vicinity) => {
    //add to user db fav
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/remove-fav`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, placeId, name, vicinity }),
    });
    const responseJSON = response.json();
    setUpdateUserData(response);
  };

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
      setUserLog(responseJSON.log);
    };
    if (userId) getUserData();
  }, [userId, updateUserData]);

  return (
    <div>
      <div className="user-view">
        <div className="header">
          <img src={logo} alt="logo" />
          <span>{username}</span>
        </div>
        <Outlet
          context={[
            userId,
            username,
            favorites,
            setUpdateUserData,
            addToFav,
            removeFav,
            updatePrice,
            priceReload,
            fetchPrices,
            priceToUpdate,
            setPriceToUpdate,
            userLog,
          ]}
        />
      </div>
    </div>
  );
};

export default Main;
