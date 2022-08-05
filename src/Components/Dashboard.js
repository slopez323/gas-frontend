import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, faStar, faList } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="main dash">
      <div
        style={{ backgroundColor: "#e07a5f" }}
        className="dash-option"
        onClick={() => navigate("/main/map")}
      >
        <p className="card-label">gas stations</p>
        <FontAwesomeIcon icon={faGasPump} />
      </div>
      <div
        style={{ backgroundColor: "#3d405b" }}
        className="dash-option"
        onClick={() => navigate("/main/fav")}
      >
        <p className="card-label">favorites</p>
        <FontAwesomeIcon icon={faStar} />
      </div>
      <div
        style={{ backgroundColor: "#81b29a" }}
        className="dash-option"
        onClick={() => navigate("/main/log")}
      >
        <p className="card-label">activity log</p>
        <FontAwesomeIcon icon={faList} />
      </div>
    </div>
  );
};

export default Dashboard;
