import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./i18n";
import Header from "./pages/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import AddDevice from "./pages/AddDevice.jsx";
import TrainingDetails from "./pages/TrainingDetails.jsx";
import FitnessStudios from "./pages/FitnessStudios.jsx";
import AddFitnessStudio from "./pages/AddFitnessStudio.jsx";
import FitnessStudioDetails from "./pages/FitnessStudioDetails.jsx";
import EditFitnessStudio from "./pages/EditFitnessStudio.jsx";
import AddUserToFitnessStudio from "./pages/AddUserToFitnessStudio.jsx";
import DBAdminDashboard from "./pages/DBAdminDashboard.jsx";
import ServerAdminDashboard from "./pages/ServerAdminDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route
            path="/registration"
            element={<Registration setIsAuth={setIsAuth} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/add-device" element={<AddDevice />} />
          <Route path="/trainings/:id" element={<TrainingDetails />} />
          <Route path="/add-fitness-studio" element={<AddFitnessStudio />} />
          <Route
            path="/fitness-studios/:id"
            element={<FitnessStudioDetails />}
          />
          <Route
            path="/edit-fitness-studio/:id"
            element={<EditFitnessStudio />}
          />
          <Route
            path="/add-user-to-fitness-studio/:id"
            element={<AddUserToFitnessStudio />}
          />
          <Route path="/fitness-studios" element={<FitnessStudios />} />
          <Route path="/db-admin" element={<DBAdminDashboard />} />
          <Route path="/server-admin" element={<ServerAdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
