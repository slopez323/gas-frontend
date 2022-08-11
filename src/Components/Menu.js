import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, faStar, faList } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Helpers/AuthHook";
import { useEffect, useRef } from "react";

const Menu = ({ showMenu, setShowMenu, setShowConfirmPopup, username }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.classList.contains("fa-bars") &&
        !e.target.parentElement.classList.contains("fa-bars")
      ) {
        setShowMenu("hide");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={`menu-container ${showMenu}`}>
      <div id="menu-username">{username}</div>
      <div className="menu-options">
        <p
          onClick={() => {
            navigate("/main/map");
            setShowMenu("hide");
          }}
        >
          {" "}
          <FontAwesomeIcon icon={faGasPump} />
          gas stations
        </p>
        <p
          onClick={() => {
            navigate("/main/fav");
            setShowMenu("hide");
          }}
        >
          {" "}
          <FontAwesomeIcon icon={faStar} />
          favorites
        </p>
        <p
          onClick={() => {
            navigate("/main/log");
            setShowMenu("hide");
          }}
        >
          {" "}
          <FontAwesomeIcon icon={faList} />
          activity log
        </p>
      </div>
      <div className="account-options">
        <p
          onClick={async () => {
            const logoutResponse = await logout();
            if (logoutResponse) navigate("/");
          }}
        >
          Log Out
        </p>
        <p
          style={{ color: "#9d0208" }}
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
