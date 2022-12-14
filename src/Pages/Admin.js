import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/myG-light.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Helpers/AuthHook";
import AdminUserList from "../ComponentsAdmin/AdminUserList";
import Loading from "../Components/Loading";

const Admin = () => {
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/main");
    }
  }, [isAdmin]);

  return (
    <div className="admin-view" style={{ height: window.innerHeight }}>
      {isLoading && <Loading />}
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
        <AdminUserList setIsLoading={setIsLoading} />
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
