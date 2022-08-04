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

  return (
    <div className="main log-container">
      {userLog
        .sort((x, y) => new Date(y.time) - new Date(x.time))
        .map((item) => {
          if (item.activity === "price-update") {
            return (
              <LogItemPrice
                item={item}
                username={username}
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

const LogItemPrice = ({ item, username }) => {
  const { placeId, placeName, placeAddress, price, type, method, time } = item;

  const deletePrice = async (username, placeId, price, type, method, time) => {
    console.log("here");
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/delete-price`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, placeId, price, type, method, time }),
    });
    const responseJSON = await response.json();
  };

  return (
    <div className="log-item">
      <span>Activity</span>
      <span>
        Price Update{" "}
        <button
          onClick={() =>
            deletePrice(username, placeId, price, type, method, time)
          }
        >
          Undo Update
        </button>
      </span>

      <span>Time</span>
      <span>{new Date(time).toLocaleString()}</span>

      <span>Station Name</span>
      <span>{placeName}</span>

      <span>Station Address</span>
      <span>{placeAddress}</span>

      <span>Type</span>
      <span>{type}</span>

      <span>Payment Method</span>
      <span>{method}</span>

      <span>Price</span>
      <span>${price}</span>
    </div>
  );
};

const LogItemFav = ({ item }) => {
  const { activity, placeName, placeAddress, time } = item;

  return (
    <div className="log-item">
      <span>Activity</span>
      <span>
        {activity === "remove-fav"
          ? "Removed Favorite Station"
          : "Added Favorite Station"}
      </span>
      <span>Time</span>
      <span>{new Date(time).toLocaleString()}</span>

      <span>Station Name</span>
      <span>{placeName}</span>

      <span>Station Address</span>
      <span>{placeAddress}</span>
    </div>
  );
};

export default Log;
