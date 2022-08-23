import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { GAS_TYPES } from "../Helpers/helpers";

const StationData = ({ data, username, placeName, placeAddress }) => {
  const types = Object.keys(GAS_TYPES);
  const methods = ["cash", "credit"];

  return (
    <div className="popup-container">
      <div className="popup station-popup">
        <div>
          <p>{placeName}</p>
          <p>{placeAddress}</p>
        </div>
        <div>
          {types.map((type) => {
            return methods.map((method) => {
              return (
                <StationLogSection
                  data={data}
                  username={username}
                  type={type}
                  method={method}
                />
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

const StationLogSection = ({ data, username, type, method }) => {
  return (
    <div>
      <p>
        {type.toUpperCase()}-{method.toUpperCase()}
      </p>
      <div className="station-table">
        <div className="station-label">
          <p>Price</p>
          <p>Updated By</p>
          <p>Update Time</p>
        </div>
        {data[type][method].length > 1 &&
          data[type][method].map((item, i) => {
            if (i > 0)
              return <StationLogItem item={item} username={username} />;
            return <></>;
          })}
      </div>
    </div>
  );
};

const StationLogItem = ({ item, username }) => {
  return (
    <div className="station-item">
      <p>
        {username === item.updatedBy && (
          <FontAwesomeIcon style={{ color: "red" }} icon={faBan} />
        )}{" "}
        {item.price}
      </p>
      <p>{item.updatedBy}</p>
      <p>{new Date(item.updateTime).toLocaleString()}</p>
    </div>
  );
};

export default StationData;
