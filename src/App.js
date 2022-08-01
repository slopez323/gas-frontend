import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Main from "./Pages/Main";
import Dashboard from "./Components/Dashboard";
import Map from "./Components/Map";
import Favorites from "./Components/Favorites";
import Log from "./Components/Log";
import UserRegistration from "./Components/UserRegistration";
import UserLogin from "./Components/UserLogin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}>
        <Route path="register" element={<UserRegistration />} />
        <Route index element={<UserLogin />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<Map />} />
        <Route path="fav" element={<Favorites />} />
        <Route path="log" element={<Log />} />
      </Route>
    </Routes>
  );
};

export default App;
