import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="main dash">
      <div className="dash-option" onClick={() => navigate("/main/map")}>
        <div className="card"></div>
        <p className="card-label">Gas Stations</p>
      </div>
      <div className="dash-option" onClick={() => navigate("/main/fav")}>
        <div className="card"></div>
        <p className="card-label">Favorites</p>
      </div>
      <div className="dash-option" onClick={() => navigate("/main/log")}>
        <div className="card"></div>
        <p className="card-label">Activity Log</p>
      </div>
    </div>
  );
};

export default Dashboard;
