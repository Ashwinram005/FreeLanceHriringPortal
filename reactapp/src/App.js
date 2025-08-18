import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostProject from "./pages/PostProject";
import BrowseProjects from "./pages/BrowseProjects";
import ManageUsers from "./pages/ManageUsers";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Proposals from "./pages/Proposals";
import Contracts from "./pages/Contracts";
import Milestones from "./pages/Milestones";
import CreateContract from "./pages/CreateContract";
import FileUpload from "./pages/FileUpload";
import Profile from "./pages/Profile";
import VisitProfile from "./pages/VisitProfile";
import ViewContracts from "./pages/ViewContracts"; // NEW ADMIN PAGE

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState((localStorage.getItem("role") || "").toUpperCase());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole((localStorage.getItem("role") || "").toUpperCase());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getDashboardRoute = () => {
    switch (role) {
      case "ADMIN":
        return "/manage-users";
      case "CLIENT":
        return "/dashboard";
      case "FREELANCER":
        return "/freelancer-dashboard";
      default:
        return "/login";
    }
  };

  const hasAccess = (allowedRoles) => allowedRoles.includes(role);

  return (
    <Router>
      <Header />
      {token && <Navbar />}
      <div style={{ minHeight: "calc(100vh - 160px)" }}>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to={getDashboardRoute()} /> : <Login setToken={setToken} setRole={setRole} />}
          />
          <Route
            path="/login"
            element={token ? <Navigate to={getDashboardRoute()} /> : <Login setToken={setToken} setRole={setRole} />}
          />
          <Route path="/register" element={token ? <Navigate to={getDashboardRoute()} /> : <Register />} />

          <Route path="/dashboard" element={token && hasAccess(["CLIENT", "ADMIN"]) ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/post-project" element={token && hasAccess(["CLIENT", "ADMIN"]) ? <PostProject /> : <Navigate to="/login" />} />
          <Route path="/browse-projects" element={token && hasAccess(["FREELANCER", "ADMIN"]) ? <BrowseProjects /> : <Navigate to="/login" />} />
          <Route path="/freelancer-dashboard" element={token && hasAccess(["FREELANCER", "ADMIN"]) ? <FreelancerDashboard /> : <Navigate to="/login" />} />
          <Route path="/manage-users" element={token && hasAccess(["ADMIN"]) ? <ManageUsers /> : <Navigate to="/login" />} />
          <Route path="/view-contracts" element={token && hasAccess(["ADMIN"]) ? <ViewContracts /> : <Navigate to="/login" />} />
          <Route path="/proposals/:projectId" element={token && hasAccess(["CLIENT", "ADMIN"]) ? <Proposals /> : <Navigate to="/login" />} />
          <Route path="/contracts" element={token && hasAccess(["CLIENT", "FREELANCER", "ADMIN"]) ? <Contracts /> : <Navigate to="/login" />} />
          <Route path="/milestones/:projectId" element={token && hasAccess(["CLIENT", "FREELANCER", "ADMIN"]) ? <Milestones /> : <Navigate to="/login" />} />
          <Route path="/contracts/create" element={token && hasAccess(["FREELANCER", "ADMIN"]) ? <CreateContract /> : <Navigate to="/login" />} />
          <Route path="/projects/:projectId/milestones/:milestoneId/upload" element={token && hasAccess(["CLIENT", "FREELANCER", "ADMIN"]) ? <FileUpload /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={<VisitProfile />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
