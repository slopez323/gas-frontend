import { useNavigate } from "react-router-dom";

const ConfirmPopup = ({ setShowConfirmPopup, userId }) => {
  const navigate = useNavigate();

  const deleteAccount = async () => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/users/delete-user/${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const responseJSON = await response.json();
    localStorage.removeItem("gasUser");
    navigate("/");
  };

  return (
    <div className="popup-container">
      <div className="popup confirm-popup">
        <p>
          You cannot undo account deletion. All user data such as favorites and
          activity log will be deleted but price updates may still remain.
        </p>
        <p>Would you like to proceed with deleting your account?</p>
        <div className="confirm-buttons">
          <button onClick={() => deleteAccount()}>Proceed</button>
          <button onClick={() => setShowConfirmPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;