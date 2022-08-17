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
  const updateBy =
    recentEntry.updatedBy.length > 8
      ? `${recentEntry.updatedBy.substring(0, 8)}...`
      : recentEntry.updatedBy;

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
          <p className="update-by">Updated by {updateBy.toUpperCase()}</p>
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
