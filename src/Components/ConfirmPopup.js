import { useNavigate } from "react-router-dom";
import { useAuth } from "../Helpers/AuthHook";

const ConfirmPopup = ({ setShowConfirmPopup }) => {
  const { userId, deleteAccount } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="popup-container">
      <div className="popup confirm-popup">
        <p>
          You cannot undo account deletion. All user data such as favorites and
          activity log will be deleted but price updates may still remain.
        </p>
        <p>Would you like to proceed with deleting your account?</p>
        <div className="confirm-buttons">
          <button
            onClick={async () => {
              const deleteResponse = await deleteAccount();
              if (deleteResponse.success) navigate("/");
            }}
          >
            Proceed
          </button>
          <button onClick={() => setShowConfirmPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
