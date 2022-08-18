import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDelete from "./ConfirmDelete";
import EditUserDetails from "./EditUserDetails";

const User = ({ user, setUpdateList, setIsLoading }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  return (
    <div>
      <hr />
      <div className="admin-userlist-item">
        <p>{user.email}</p>
        <p>{user.username}</p>
        <p>{user.id}</p>
        <p>{user.access.toUpperCase()}</p>
        <div className="admin-actions">
          <FontAwesomeIcon
            icon={faPenToSquare}
            style={{ color: "#e07a5f" }}
            onClick={() => setShowEditUser(true)}
          />{" "}
          <FontAwesomeIcon
            icon={faCircleMinus}
            style={{ color: "#9d0208" }}
            onClick={() => setShowConfirmDelete(true)}
          />
        </div>
      </div>
      {showConfirmDelete && (
        <ConfirmDelete
          username={user.username}
          id={user.id}
          setShowConfirmDelete={setShowConfirmDelete}
          setUpdateList={setUpdateList}
          setIsLoading={setIsLoading}
        />
      )}
      {showEditUser && (
        <EditUserDetails
          email={user.email}
          username={user.username}
          id={user.id}
          access={user.access}
          setShowEditUser={setShowEditUser}
          setUpdateList={setUpdateList}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default User;
