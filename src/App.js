import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import Map from "./Components/Map";
import UserRegistration from "./Components/UserRegistration";
import UserLogin from "./Components/UserLogin";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route path="register" element={<UserRegistration />} />
          <Route index element={<UserLogin />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/map" element={<Map />}></Route>
      </Routes>
    </>
  );
};

export default App;
