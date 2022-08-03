import PriceByType from "./PriceByType";

const PriceTable = ({
  setShowUpdatePopup,
  setPriceToUpdate,
  prices,
  place_id,
}) => {
  const typeArr = ["regular", "midgrade", "premium", "diesel"];

  return (
    <>
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
    </>
  );
};

export default PriceTable;
