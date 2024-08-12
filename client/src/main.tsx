import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import LoginSuccess from "./pages/LoginSuccess";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import AuthGuard from "./hooks/AuthGuard";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthGuard>{children}</AuthGuard>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login-success" element={<LoginSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>,
);
