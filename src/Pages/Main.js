import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFileShield } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import logo from "../Assets/myG.png";
import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../Components/Menu";
import ConfirmPopup from "../Components/ConfirmPopup";
import Loading from "../Components/Loading";
import { useAuth } from "../Helpers/AuthHook";
import NewPassword from "../Components/NewPassword";

const Main = () => {
  const [username, setUsername] = useState("");
  const [priceToUpdate, setPriceToUpdate] = useState();
  const [favorites, setFavorites] = useState([]);
  const [userLog, setUserLog] = useState([]);
  const [updateUserData, setUpdateUserData] = useState();
  const [priceReload, setPriceReload] = useState();
  const [showMenu, setShowMenu] = useState("hide");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const { userId, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchPrices = async (placeId) => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/station/${placeId}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setIsLoading(false);
    return responseJSON;
  };

  const updatePrice = async (price, type, method, placeId, name, vicinity) => {
    setIsLoading(true);
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
    const responseJSON = await response.json();
    setPriceReload(response);
    setUpdateUserData(response);
    setIsLoading(false);
  };

  const addToFav = async (placeId, name, vicinity) => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/add-fav`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, placeId, name, vicinity }),
    });
    const responseJSON = await response.json();
    setUpdateUserData(response);
    setIsLoading(false);
  };

  const removeFav = async (placeId, name, vicinity) => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/remove-fav`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, placeId, name, vicinity }),
    });
    const responseJSON = await response.json();
    setUpdateUserData(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (userId) {
      navigate("/main");
    } else navigate("/");
  }, [userId]);

  useEffect(() => {
    setPage(1);
  }, [filterType]);

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/user?id=${userId}&page=${page}&limit=10&filter=${filterType}&sort=${sortType}`;
      const response = await fetch(url);
      const responseJSON = await response.json();

      setUsername(responseJSON.message.username);
      setFavorites(responseJSON.message.favorites);
      setUserLog(responseJSON.message.log);
      setNumPages(Math.ceil(responseJSON.message.totalLogs / 10));
      setIsLoading(false);
    };
    if (userId) getUserData();
  }, [userId, updateUserData, sortType, filterType, page]);

  return (
    <div className="user-view" style={{ height: window.innerHeight }}>
      {isLoading && <Loading />}
      {showChangePass && <NewPassword setShowChangePass={setShowChangePass} />}
      <div className="header">
        <FontAwesomeIcon
          icon={faBars}
          className={showMenu === "show" ? "show" : ""}
          onClick={() =>
            showMenu === "hide" ? setShowMenu("show") : setShowMenu("hide")
          }
        />
        <img
          src={logo}
          alt="logo"
          onClick={() => {
            setShowMenu("hide");
            navigate("/main");
          }}
        />
        {isAdmin && (
          <span className="admin-btn" onClick={(e) => navigate("/admin")}>
            <FontAwesomeIcon icon={faFileShield} /> To Admin View
          </span>
        )}
      </div>
      <Menu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowConfirmPopup={setShowConfirmPopup}
        username={username}
        setShowChangePass={setShowChangePass}
      />
      {showConfirmPopup && (
        <ConfirmPopup setShowConfirmPopup={setShowConfirmPopup} />
      )}
      <Outlet
        context={[
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
          setIsLoading,
          userLog,
          filterType,
          setFilterType,
          sortType,
          setSortType,
          numPages,
          page,
          setPage,
        ]}
      />
    </div>
  );
};

export default Main;
