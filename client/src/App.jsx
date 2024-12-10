
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Lander from "./pages/Lander";
import Admin from "./pages/Admin";
import AnimeDetail from "./pages/AnimeDetail";

const App = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <>
      <Router>
        <Routes>
          {isAuthenticated !== null && (
            <>
              <Route path="/" element={<Navigate to="/lander" />} />
              <Route path="/lander" element={<Lander />} />
              <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
              <Route path="/admin" element={isAuthenticated && user.admin ? <Admin /> : <Navigate to="/login" />} />
              <Route path="/anime/:id" element={isAuthenticated ? <AnimeDetail /> : <Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>

      <ToastContainer position="bottom-center" autoClose={3000} theme="dark" />
    </>
  );
};

export default App;
