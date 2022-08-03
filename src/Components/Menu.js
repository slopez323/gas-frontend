import { useNavigate } from "react-router-dom";

const Menu = ({ showMenu, setShowMenu, setShowConfirmPopup }) => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("gasUser");
    navigate("/");
  };

  return (
    <div className={`menu-container ${showMenu}`}>
      <div>
        <p
          onClick={() => {
            navigate("/main/map");
            setShowMenu("hide");
          }}
        >
          Gas Stations
        </p>
        <p
          onClick={() => {
            navigate("/main/fav");
            setShowMenu("hide");
          }}
        >
          Favorites
        </p>
        <p
          onClick={() => {
            navigate("/main/log");
            setShowMenu("hide");
          }}
        >
          Activity Log
        </p>
      </div>
      <div>
        <p onClick={() => logOut()}>Log Out</p>
        <p
          onClick={() => {
            setShowConfirmPopup(true);
            setShowMenu("hide");
          }}
        >
          Delete Account
        </p>
      </div>
    </div>
  );
};

export default Menu;
