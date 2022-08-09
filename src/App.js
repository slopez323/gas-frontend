import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Main from "./Pages/Main";
import Dashboard from "./Components/Dashboard";
import MapPage from "./Components/Map";
import Favorites from "./Components/Favorites";
import Log from "./Components/Log";
import UserRegistration from "./Components/UserRegistration";
import UserLogin from "./Components/UserLogin";
import Admin from "./Pages/Admin";
import AdminUserList from "./Components/AdminUserList";
import AdminStationList from "./Components/AdminStationList";
import { useAuth } from "./Helpers/AuthHook";

const App = () => {
  // const { userId, isAdmin } = useAuth();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (userId) {
  //     navigate("/main");
  //   } else {
  //     navigate("/");
  //   }
  // }, [userId]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />}>
        <Route path="register" element={<UserRegistration />} />
        <Route index element={<UserLogin />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="fav" element={<Favorites />} />
        <Route path="log" element={<Log />} />
      </Route>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminUserList />} />
        <Route path="station" element={<AdminStationList />} />
      </Route>
    </Routes>
  );
};

export default App;
