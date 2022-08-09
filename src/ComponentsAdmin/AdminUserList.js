import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import User from "./User";
import NewUserDetails from "./NewUserDetails";

const AdminUserList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [pageNums, setPageNums] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [updateList, setUpdateList] = useState();
  const [showCreateNew, setShowCreateNew] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const url = `${process.env.REACT_APP_URL_ENDPOINT}/admin/all-users?page=${page}&limit=10&filter=${filterType}`;
      const response = await fetch(url);
      const responseJSON = await response.json();

      if (responseJSON.success) {
        setAllUsers(responseJSON.message);
        setNumPages(Math.ceil(responseJSON.count / 10));
      }
    };
    fetchUsers();
  }, [page, filterType, updateList]);

  useEffect(() => {
    setPageNums(Array.from({ length: numPages }, (_, i) => i + 1));
  }, [numPages]);

  return (
    <div className="admin-list">
      <div className="admin-list-top">
        <FontAwesomeIcon
          title="Add User"
          icon={faCirclePlus}
          onClick={() => setShowCreateNew(true)}
        />
        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Users</option>
          <option value="admin">Admin</option>
          <option value="user">Non-admin</option>
        </select>
      </div>
      <div>
        <div className="admin-userlist-label">
          <p>Username</p>
          <p>User ID</p>
          <p>User Access</p>
          <p>Actions</p>
        </div>
        {allUsers.map((user) => {
          return (
            <User user={user} key={user.id} setUpdateList={setUpdateList} />
          );
        })}
      </div>
      {allUsers && (
        <div className="page-div">
          Page
          {pageNums.map((i) => {
            return (
              <span
                className={`page-num ${
                  Number(page) === Number(i) ? "current" : ""
                }`}
                key={`page-${i}`}
                onClick={(e) => setPage(e.target.textContent)}
              >
                {i}
              </span>
            );
          })}
        </div>
      )}
      {showCreateNew && (
        <NewUserDetails
          setUpdateList={setUpdateList}
          setShowCreateNew={setShowCreateNew}
        />
      )}
    </div>
  );
};

export default AdminUserList;
