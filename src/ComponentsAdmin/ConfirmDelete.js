const ConfirmDelete = ({
  username,
  id,
  setShowConfirmDelete,
  setUpdateList,
  setIsLoading,
}) => {
  const deleteUser = async (id) => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/admin/delete-user/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const responseJSON = await response.json();
    setIsLoading(false);
    return responseJSON;
  };

  return (
    <div className="popup-container">
      <div className="popup confirm-popup">
        <p>Delete {username.toUpperCase()} from system?</p>
        <div className="confirm-buttons">
          <button
            style={{ fontWeight: "bold" }}
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
