import { useState, useEffect, useRef } from "react";
import PriceUpdate from "./PriceUpdate";

const emptyPrices = {
  regular: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  midgrade: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  premium: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  diesel: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
};

const List = ({ item, clicked, setClicked, username }) => {
  const { place_id, name, vicinity } = item;
  const [prices, setPrices] = useState([]);
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
      if (!responseJSON.no_prices) setPrices(responseJSON.message);
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
    console.log(prices.midgrade);
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
        <table>
          <tr>
            <th></th>
            <th>Regular</th>
            <th>Midgrade</th>
            <th>Premium</th>
            <th>Diesel</th>
          </tr>
          <tr>
            <th>Cash</th>
            {/* <td>
                <div>$4.50</div>
  
                <p>Updated by someone</p>
                <p>2 hours ago</p>
              </td> */}
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.regular.cash.price,
                  type: "regular",
                  method: "cash",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.regular && prices.regular.cash
                  ? prices.regular.cash.price
                  : "--"}
              </div>
              {prices.regular && prices.regular.cash && (
                <>
                  <p>Updated by {prices.regular.cash.updatedBy}</p>
                  <p>{prices.regular.cash.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.midgrade.cash.price,
                  type: "midgrade",
                  method: "cash",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.midgrade && prices.midgrade.cash
                  ? prices.midgrade.cash.price
                  : "--"}
              </div>
              {prices.midgrade && prices.midgrade.cash && (
                <>
                  <p>Updated by {prices.midgrade.cash.updatedBy}</p>
                  <p>{prices.midgrade.cash.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.premium.cash.price,
                  type: "premium",
                  method: "cash",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.premium && prices.premium.cash
                  ? prices.premium.cash.price
                  : "--"}
              </div>
              {prices.premium && prices.premium.cash && (
                <>
                  <p>Updated by {prices.premium.cash.updatedBy}</p>
                  <p>{prices.premium.cash.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.diesel.cash.price,
                  type: "diesel",
                  method: "cash",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.diesel && prices.diesel.cash
                  ? prices.diesel.cash.price
                  : "--"}
              </div>
              {prices.diesel && prices.diesel.cash && (
                <>
                  <p>Updated by {prices.diesel.cash.updatedBy}</p>
                  <p>{prices.diesel.cash.updateTime}</p>
                </>
              )}
            </td>
          </tr>
          <tr>
            <th>Credit</th>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.regular.credit.price,
                  type: "regular",
                  method: "credit",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.regular && prices.regular.credit
                  ? prices.regular.credit.price
                  : "--"}
              </div>
              {prices.regular && prices.regular.credit && (
                <>
                  <p>Updated by {prices.regular.credit.updatedBy}</p>
                  <p>{prices.regular.credit.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.midgrade.credit.price,
                  type: "midgrade",
                  method: "credit",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.midgrade && prices.midgrade.credit
                  ? prices.midgrade.credit.price
                  : "--"}
              </div>
              {prices.midgrade && prices.midgrade.credit && (
                <>
                  <p>Updated by {prices.midgrade.credit.updatedBy}</p>
                  <p>{prices.midgrade.credit.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.premium.credit.price,
                  type: "premium",
                  method: "credit",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.premium && prices.premium.credit
                  ? prices.premium.credit.price
                  : "--"}
              </div>
              {prices.premium && prices.premium.credit && (
                <>
                  <p>Updated by {prices.premium.credit.updatedBy}</p>
                  <p>{prices.premium.credit.updateTime}</p>
                </>
              )}
            </td>
            <td
              onClick={() => {
                setShowUpdatePopup(true);
                setPriceToUpdate({
                  price: prices.diesel.credit.price,
                  type: "diesel",
                  method: "credit",
                  placeId: place_id,
                });
              }}
            >
              <div>
                $
                {prices.diesel && prices.diesel.credit
                  ? prices.diesel.credit.price
                  : "--"}
              </div>
              {prices.diesel && prices.diesel.credit && (
                <>
                  <p>Updated by {prices.diesel.credit.updatedBy}</p>
                  <p>{prices.diesel.credit.updateTime}</p>
                </>
              )}
            </td>
          </tr>
        </table>
      </div>
      <hr />
    </div>
  );
};

export default List;
