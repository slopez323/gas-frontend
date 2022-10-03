import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PriceTable from "./PriceTable";
import PriceUpdate from "./PriceUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { DeepCopy, GAS_TYPES } from "../Helpers/helpers";

const Favorites = () => {
  const [
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
  ] = useOutletContext();

  return (
    <div
      className="main fav-container"
      style={{ maxHeight: window.innerHeight - 145 }}
    >
      {favorites.length === 0 && <p className="empty">No favorites.</p>}
      {favorites.map((item) => {
        return (
          <FavItem
            item={item}
            fetchPrices={fetchPrices}
            removeFav={removeFav}
            updatePrice={updatePrice}
            priceReload={priceReload}
            priceToUpdate={priceToUpdate}
            setPriceToUpdate={setPriceToUpdate}
            setIsLoading={setIsLoading}
            key={item.placeId}
          />
        );
      })}
    </div>
  );
};

const FavItem = ({
  item,
  fetchPrices,
  removeFav,
  updatePrice,
  priceReload,
  priceToUpdate,
  setPriceToUpdate,
  setIsLoading,
}) => {
  const { placeId, placeName, placeAddress } = item;
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [prices, setPrices] = useState(DeepCopy(GAS_TYPES));
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    placeAddress
  )}&query_place_id=${placeId}`;

  const runFetch = async () => {
    setIsLoading(true);
    const data = await fetchPrices(placeId);
    if (data.success && !data.no_prices) setPrices(data.message);
    setIsLoading(false);
  };

  useEffect(() => {
    runFetch();
  }, [priceReload]);

  return (
    <div data-id={placeId} className="fav-item">
      {showUpdatePopup && (
        <PriceUpdate
          priceToUpdate={priceToUpdate}
          updatePrice={updatePrice}
          name={placeName}
          vicinity={placeAddress}
          setShowUpdatePopup={setShowUpdatePopup}
        />
      )}
      <div className="fav-item-title">
        <div>
          <p className="fav-name">{placeName}</p>
          <p className="fav-address">{placeAddress}</p>
          <a href={url} target="_blank">
            View station in Google Maps
          </a>
        </div>
        <div className="fav-star-div">
          <FontAwesomeIcon
            onClick={() => removeFav(placeId, placeName, placeAddress)}
            icon={faStarSolid}
            style={{ color: "#ffbd00" }}
          />
        </div>
      </div>
      <div className="price-table fav-prices">
        <PriceTable
          setShowUpdatePopup={setShowUpdatePopup}
          setPriceToUpdate={setPriceToUpdate}
          prices={prices}
          place_id={placeId}
        />
      </div>
    </div>
  );
};

export default Favorites;
