import { useState } from "react";

const PriceUpdate = ({
  priceToUpdate,
  updatePrice,
  name,
  vicinity,
  setShowUpdatePopup,
}) => {
  const { type, method, placeId } = priceToUpdate;
  const price = priceToUpdate.price === "--" ? "0.00" : priceToUpdate.price;
  const priceArr = price.length === 4 ? [...price] : ["0", ...price];
  const [newPrice, setNewPrice] = useState(
    JSON.parse(JSON.stringify(priceArr))
  );

  return (
    <div className="popup-container">
      <div className="popup update-popup">
        <div className="price-input">
          $
          {priceArr.map((x, i) => {
            if (x !== ".") {
              return (
                <input
                  type="number"
                  max="9"
                  key={i}
                  value={newPrice[i]}
                  onChange={(e) => {
                    const priceCopy = JSON.parse(JSON.stringify(newPrice));
                    priceCopy[i] = e.target.value;
                    setNewPrice([...priceCopy]);
                  }}
                />
              );
            } else {
              return <span key={i}>.</span>;
            }
          })}
        </div>
        <button
          onClick={async () => {
            const finalPrice =
              newPrice[0] === "0"
                ? newPrice.join("").substring(1)
                : newPrice.join("");
            await updatePrice(
              finalPrice,
              type,
              method,
              placeId,
              name,
              vicinity
            );
            setShowUpdatePopup(false);
          }}
        >
          Submit Price
        </button>
        <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default PriceUpdate;
