import { useState, useEffect, useRef } from "react";
import PriceUpdate from "./PriceUpdate";
import ReactTimeAgo from "react-time-ago";

const GAS_PAYMENT = {
  cash: { price: "--", updatedBy: "", updateTime: "" },
  credit: { price: "--", updatedBy: "", updateTime: "" },
};

const GAS_TYPES = {
  regular: GAS_PAYMENT,
  midgrade: GAS_PAYMENT,
  premium: GAS_PAYMENT,
  diesel: GAS_PAYMENT,
};

const typeArr = ["regular", "midgrade", "premium", "diesel"];

const List = ({ item, clicked, setClicked, username }) => {
  const { place_id, name, vicinity } = item;
  const [prices, setPrices] = useState(JSON.parse(JSON.stringify(GAS_TYPES)));
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [priceToUpdate, setPriceToUpdate] = useState();
  const [reload, setReload] = useState();
  const selected = place_id === clicked ? "selected" : "";
  const divRef = useRef(place_id);

  const updatePrice = async (price, type, method, placeId) => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/update-price`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        type,
        method,
        placeId,
        name,
        vicinity,
        username,
      }),
    });
    const responseJSON = response.json();
    setReload(response);
  };

  useEffect(() => {
    const fetchPrices = async (placeId) => {
      const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/station/${placeId}`;
      const response = await fetch(url);
      const responseJSON = await response.json();
      if (responseJSON.success && !responseJSON.no_prices)
        setPrices(responseJSON.message);
    };
    fetchPrices(place_id);
  }, [reload]);

  useEffect(() => {
    if (divRef.current.classList.contains("selected"))
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [clicked]);

  useEffect(() => {
    console.log(prices);
  }, [prices]);

  return (
    <div
      data-id={place_id}
      className={`list-item ${selected}`}
      ref={divRef}
      onClick={() => setClicked(place_id)}
    >
      {showUpdatePopup && (
        <PriceUpdate
          priceToUpdate={priceToUpdate}
          updatePrice={updatePrice}
          setShowUpdatePopup={setShowUpdatePopup}
        />
      )}
      <p className="list-name">{name}</p>
      <p className="list-address">{vicinity}</p>
      <div className="list-prices">
        <div></div>
        <div className="gas-type">Regular</div>
        <div className="gas-type">Midgrade</div>
        <div className="gas-type">Premium</div>
        <div className="gas-type">Diesel</div>
        <div className="gas-method">Cash</div>
        {typeArr.map((type) => {
          return (
            <PriceByType
              type={type}
              method="cash"
              setShowUpdatePopup={setShowUpdatePopup}
              setPriceToUpdate={setPriceToUpdate}
              prices={prices}
              place_id={place_id}
              key={`cash-${type}`}
            />
          );
        })}
        <div className="gas-method">Credit</div>
        {typeArr.map((type) => {
          return (
            <PriceByType
              type={type}
              method="credit"
              setShowUpdatePopup={setShowUpdatePopup}
              setPriceToUpdate={setPriceToUpdate}
              prices={prices}
              place_id={place_id}
              key={`credit-${type}`}
            />
          );
        })}
      </div>
      <hr />
    </div>
  );
};

const PriceByType = ({
  type,
  method,
  setShowUpdatePopup,
  setPriceToUpdate,
  prices,
  place_id,
}) => {
  return (
    <div
      className="gas-price-div"
      onClick={() => {
        setShowUpdatePopup(true);
        setPriceToUpdate({
          price: prices[type][method]["price"],
          type,
          method,
          placeId: place_id,
        });
      }}
    >
      <div className="gas-price">${prices[type][method]["price"]}</div>
      {prices[type][method]["updatedBy"] !== "" && (
        <>
          <p className="update-by">
            Updated by {prices[type][method]["updatedBy"]}
          </p>
          <p className="update-time">
            {
              <ReactTimeAgo
                date={prices[type][method]["updateTime"]}
                locale="en-US"
              />
            }
          </p>
        </>
      )}
    </div>
  );
};

export default List;
