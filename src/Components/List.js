import { useState, useEffect, useRef } from "react";
import PriceUpdate from "./PriceUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import PriceTable from "./PriceTable";

const List = ({
  item,
  clicked,
  setClicked,
  favorites,
  addToFav,
  removeFav,
  updatePrice,
  priceToUpdate,
  setPriceToUpdate,
  setIsLoading,
}) => {
  const { place_id, name, prices, vicinity, dist } = item;
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const selected = place_id === clicked ? "selected" : "";
  const url = `https://www.google.com/maps/place/?q=place_id:${place_id}`;

  const divRef = useRef(place_id);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (divRef.current.classList.contains("selected"))
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [clicked]);

  useEffect(() => {
    const found = favorites.find((item) => item.placeId === place_id);
    if (typeof found !== "undefined") {
      setIsFav(true);
    } else {
      setIsFav(false);
    }
  }, [favorites]);

  return (
    <div data-id={place_id} className={`list-item ${selected}`} ref={divRef}>
      {showUpdatePopup && (
        <PriceUpdate
          priceToUpdate={priceToUpdate}
          updatePrice={updatePrice}
          name={name}
          vicinity={vicinity}
          setShowUpdatePopup={setShowUpdatePopup}
        />
      )}
      <p className="list-name" onClick={() => setClicked(place_id)}>
        {name}
      </p>
      <p className="list-address" onClick={() => setClicked(place_id)}>
        {vicinity}
      </p>
      <p className="list-distance" onClick={() => setClicked(place_id)}>
        {dist} mi
      </p>
      <div className="price-table list-prices">
        <PriceTable
          setShowUpdatePopup={setShowUpdatePopup}
          setPriceToUpdate={setPriceToUpdate}
          prices={prices}
          place_id={place_id}
        />
      </div>
      <div className="star-div">
        <a href={url} target="_blank">
          View station in Google Maps
        </a>
        {!isFav && (
          <FontAwesomeIcon
            onClick={() => addToFav(place_id, name, vicinity)}
            icon={faStar}
            style={{ color: "#ffbd00" }}
          />
        )}
        {isFav && (
          <FontAwesomeIcon
            onClick={() => removeFav(place_id, name, vicinity)}
            icon={faStarSolid}
            style={{ color: "#ffbd00" }}
          />
        )}
      </div>
    </div>
  );
};

export default List;
