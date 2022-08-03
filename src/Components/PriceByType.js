import ReactTimeAgo from "react-time-ago";

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

export default PriceByType;
