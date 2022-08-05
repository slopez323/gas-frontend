import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const Log = () => {
  const [
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
  ] = useOutletContext();
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("desc");

  const sortList = (x, y) =>
    sortType === "asc"
      ? new Date(x.time) - new Date(y.time)
      : new Date(y.time) - new Date(x.time);

  const filterList = (x) => {
    if (filterType === "fav") {
      return x.activity === "add-fav" || x.activity === "remove-fav";
    } else if (filterType === "price") {
      return x.activity === "price-update";
    } else return x;
  };

  return (
    <div className="main log-container">
      <div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Activities</option>
          <option value="fav">Favorites</option>
          <option value="price">Price Updates</option>
        </select>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      {userLog
        .filter(filterList)
        .sort(sortList)
        .map((item) => {
          if (item.activity === "price-update") {
            return (
              <LogItemPrice
                item={item}
                username={username}
                setUpdateUserData={setUpdateUserData}
                key={`${item.activity}-${item.time}`}
              />
            );
          } else if (
            item.activity === "remove-fav" ||
            item.activity === "add-fav"
          ) {
            return (
              <LogItemFav item={item} key={`${item.activity}-${item.time}`} />
            );
          } else return <></>;
        })}
    </div>
  );
};

const LogItemPrice = ({ item, username, setUpdateUserData }) => {
  const {
    placeId,
    placeName,
    placeAddress,
    price,
    type,
    method,
    time,
    activityId,
  } = item;

  const deletePrice = async (username, placeId, type, method, activityId) => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/delete-price`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, placeId, type, method, activityId }),
    });
    const responseJSON = await response.json();
    setUpdateUserData(response);
  };

  return (
    <div className="log-item">
      <span className="log-label">Activity</span>
      <span className="log-value">
        Price Update{" "}
        <button
          onClick={() =>
            deletePrice(username, placeId, type, method, activityId)
          }
        >
          Delete Price
        </button>
      </span>

      <span className="log-label">Time</span>
      <span className="log-value">{new Date(time).toLocaleString()}</span>

      <span className="log-label">Station Name</span>
      <span className="log-value">{placeName}</span>

      <span className="log-label">Station Address</span>
      <span className="log-value">{placeAddress}</span>

      <span className="log-label">Type</span>
      <span className="log-value">{type.toUpperCase()}</span>

      <span className="log-label">Payment Method</span>
      <span className="log-value">{method.toUpperCase()}</span>

      <span className="log-label">Price</span>
      <span className="log-value">${price}</span>
    </div>
  );
};

const LogItemFav = ({ item }) => {
  const { activity, placeName, placeAddress, time } = item;

  return (
    <div className="log-item">
      <span className="log-label">Activity</span>
      <span className="log-value">
        {activity === "remove-fav"
          ? "Removed Favorite Station"
          : "Added Favorite Station"}
      </span>
      <span className="log-label">Time</span>
      <span className="log-value">{new Date(time).toLocaleString()}</span>

      <span className="log-label">Station Name</span>
      <span className="log-value">{placeName}</span>

      <span className="log-label">Station Address</span>
      <span className="log-value">{placeAddress}</span>
    </div>
  );
};

export default Log;
