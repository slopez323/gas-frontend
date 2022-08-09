const ConfirmDelete = ({
  username,
  id,
  setShowConfirmDelete,
  setUpdateList,
}) => {
  const deleteUser = async (id) => {
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/admin/delete-user/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const responseJSON = await response.json();
    return responseJSON;
  };

  return (
    <div className="popup-container">
      <div className="popup confirm-popup">
        <p>Delete {username.toUpperCase()} from system?</p>
        <div className="confirm-buttons">
          <button
            className="admin-buttons"
            onClick={async () => {
              const deleteResponse = await deleteUser(id);
              if (deleteResponse.success) {
                setUpdateList(deleteResponse);
                setShowConfirmDelete(false);
              }
            }}
          >
            Proceed
          </button>
          <button
            className="admin-buttons"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
