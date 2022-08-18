import { useState } from "react";

const EditUserDetails = ({
  email,
  username,
  id,
  access,
  setShowEditUser,
  setUpdateList,
  setIsLoading,
}) => {
  const [editEmail, setEditEmail] = useState(email);
  const [editUsername, setEditUsername] = useState(username);
  const [editAccess, setEditAccess] = useState(access);

  const editUser = async (id, email, username, access) => {
    setIsLoading(true);
    const userDetails = { id, email, username, access };
    const url = `${process.env.REACT_APP_URL_ENDPOINT}/admin/edit-user`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const responseJSON = await response.json();
    setUpdateList(response);
    setIsLoading(false);
    return responseJSON;
  };

  return (
    <div className="popup-container">
      <div className="popup edit-user-popup">
        <div>
          <p>ID:</p> {id}
        </div>
        <div>
          <p>Email Address:</p>
          <input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
        </div>
        <div>
          <p>Username:</p>
          <input
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
        </div>
        <div>
          <p>Access:</p>
          <select
            value={editAccess}
            onChange={(e) => setEditAccess(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          style={{ fontWeight: "bold" }}
          className="admin-buttons"
          onClick={async () => {
            const editResponse = await editUser(
              id,
              editEmail,
              editUsername,
              editAccess
            );
            if (editResponse.success) {
              setShowEditUser(false);
            }
          }}
        >
          Save Changes
        </button>
        <button
          className="admin-buttons"
          onClick={() => setShowEditUser(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserDetails;
