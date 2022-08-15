import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/myG-light.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Helpers/AuthHook";
import AdminUserList from "../ComponentsAdmin/AdminUserList";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/main");
    }
  }, [isAdmin]);

  return (
    <div className="admin-view" style={{ height: window.innerHeight }}>
      <div className="header">
        <img src={logo} alt="logo" />
      </div>
      <div
        className="admin-main"
        style={{ maxHeight: window.innerHeight - 156 }}
      >
        <div className="sidebar">
          <p>myGas Users</p>
        </div>
        <AdminUserList />
      </div>
      {isAdmin && (
        <span className="admin-btn" onClick={(e) => navigate("/main")}>
          {" "}
          <FontAwesomeIcon icon={faCircleUser} /> Back To User View
        </span>
      )}
    </div>
  );
};

export default Admin;
