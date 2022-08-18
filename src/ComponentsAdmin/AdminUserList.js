import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import User from "./User";
import NewUserDetails from "./NewUserDetails";

const AdminUserList = ({ setIsLoading }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [pageNums, setPageNums] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [updateList, setUpdateList] = useState();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [searchType, setSearchType] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const url = `${
        process.env.REACT_APP_URL_ENDPOINT
      }/admin/all-users?page=${page}&limit=10&filter=${filterType}&searchType=${searchType}&searchTerm=${
        searchTerm ? searchTerm : "none"
      }`;
      const response = await fetch(url);
      const responseJSON = await response.json();

      if (responseJSON.success) {
        setAllUsers(responseJSON.message);
        setNumPages(Math.ceil(responseJSON.count / 10));
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, [page, filterType, updateList, searchTerm]);

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
        <div className="admin-list-top-right">
          <div className="admin-search">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="email">Email</option>
              <option value="username">Username</option>
            </select>
            <input
              ref={searchRef}
              placeholder={`Search ${searchType}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchTerm(e.target.value);
              }}
            />
            <FontAwesomeIcon
              title="search"
              icon={faMagnifyingGlass}
              onClick={() => setSearchTerm(searchRef.current.value)}
            />
            <FontAwesomeIcon
              title="clear"
              icon={faXmark}
              style={{ color: "#bb3e03" }}
              onClick={() => {
                setSearchTerm("");
                searchRef.current.value = "";
              }}
            />
          </div>
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Users</option>
            <option value="admin">Admin</option>
            <option value="user">Non-admin</option>
          </select>
        </div>
      </div>
      <div>
        <div className="admin-userlist-label">
          <p>Email</p>
          <p>Username</p>
          <p>User ID</p>
          <p>User Access</p>
          <p>Actions</p>
        </div>
        {allUsers.map((user) => {
          return (
            <User
              user={user}
              key={user.id}
              setUpdateList={setUpdateList}
              setIsLoading={setIsLoading}
            />
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
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default AdminUserList;
