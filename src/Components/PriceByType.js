import ReactTimeAgo from "react-time-ago";

const PriceByType = ({
  type,
  method,
  setShowUpdatePopup,
  setPriceToUpdate,
  prices,
  place_id,
}) => {
  const recentEntry = prices[type][method][prices[type][method].length - 1];
  return (
    <div
      className="gas-price-div"
      onClick={() => {
        setShowUpdatePopup(true);
        setPriceToUpdate({
          price: recentEntry["price"],
          type,
          method,
          placeId: place_id,
        });
      }}
    >
      <div className="gas-price">${recentEntry.price}</div>
      {recentEntry.updatedBy !== "" && (
        <>
          <p className="update-by">
            Updated by {recentEntry.updatedBy.toUpperCase()}
          </p>
          <p className="update-time">
            {
              <ReactTimeAgo
                date={new Date(recentEntry.updateTime)}
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
