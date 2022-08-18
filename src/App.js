import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Main from "./Pages/Main";
import Dashboard from "./Components/Dashboard";
import MapPage from "./Components/Map";
import Favorites from "./Components/Favorites";
import Log from "./Components/Log";
import UserRegistration from "./Components/UserRegistration";
import UserLogin from "./Components/UserLogin";
import Admin from "./Pages/Admin";
import ForgotPass from "./Components/ForgotPass";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}>
        <Route path="register" element={<UserRegistration />} />
        <Route index element={<UserLogin />} />
        <Route path="forget" element={<ForgotPass />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="fav" element={<Favorites />} />
        <Route path="log" element={<Log />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default App;
