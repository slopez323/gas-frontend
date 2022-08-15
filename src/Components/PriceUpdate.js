import { useEffect, useState } from "react";
import { blankPrice, DeepCopy, numKeys } from "../Helpers/helpers";

const PriceUpdate = ({
  priceToUpdate,
  updatePrice,
  name,
  vicinity,
  setShowUpdatePopup,
}) => {
  const { type, method, placeId } = priceToUpdate;
  const [keypress, setKeypress] = useState({ key: "", count: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [priceArr, setPriceArr] = useState(DeepCopy(blankPrice));
  const [inputError, setInputError] = useState(false);

  const submitPrice = async () => {
    const finalPrice = priceArr.join("");
    await updatePrice(finalPrice, type, method, placeId, name, vicinity);
    setShowUpdatePopup(false);
  };

  const checkInput = () => {
    const priceCopy = DeepCopy(priceArr);
    const priceSplit = priceCopy.join("").split(".");
    if (priceSplit[1].length < 2) {
      setInputError(true);
    } else {
      submitPrice();
    }
  };

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (
        (Number(e.key) >= 0 && Number(e.key) <= 9) ||
        e.key === "Backspace" ||
        e.key === "Enter" ||
        e.key === "Escape"
      ) {
        const keyData = { key: e.key, count: keypress.count + 1 };
        setKeypress(keyData);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (keypress.count > 0) {
      const priceCopy = DeepCopy(priceArr);
      if (keypress.key === "Backspace") {
        setPriceArr(["", priceCopy[0], ".", priceCopy[1], priceCopy[3]]);
      } else if (keypress.key === "Enter") {
        checkInput();
      } else if (keypress.key === "Escape") {
        setShowUpdatePopup(false);
      } else {
        setPriceArr([
          priceCopy[1],
          priceCopy[3],
          ".",
          priceCopy[4],
          keypress.key,
        ]);
      }
    }
  }, [keypress]);

  useEffect(() => {
    const error = setTimeout(() => {
      setInputError(false);
    }, 600);
    return () => clearTimeout(error);
  }, [inputError]);

  return (
    <div className="popup-container" style={{ maxHeight: window.innerHeight }}>
      <div className="popup update-popup">
        <p>
          {type.toUpperCase()}: {method.toUpperCase()}
        </p>
        <div className={`price-input ${inputError ? "input-error" : ""}`}>
          $
          {priceArr.map((x, i) => {
            if (x !== ".") {
              return (
                <span className="number-input" key={i}>
                  {x}
                </span>
              );
            } else {
              return <span key={i}>.</span>;
            }
          })}
        </div>
        <button
          style={{ fontWeight: "bold" }}
          onClick={async () => {
            checkInput();
          }}
        >
          Submit Price
        </button>
        <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
      </div>
      {isMobile && <NumKeypad keypress={keypress} setKeypress={setKeypress} />}
    </div>
  );
};

const NumKeypad = ({ keypress, setKeypress }) => {
  const handleMobileKey = (key) => {
    if (key === "←") {
      setKeypress({ key: "Backspace", count: keypress.count + 1 });
    } else if (key !== "") {
      setKeypress({ key, count: keypress.count + 1 });
    }
  };
  return (
    <div className="num-keypad">
      {numKeys.map((num) => {
        return (
          <span
            className="num-keys"
            onClick={(e) => handleMobileKey(e.target.textContent)}
            key={num}
          >
            {num}
          </span>
        );
      })}
    </div>
  );
};

export default PriceUpdate;
