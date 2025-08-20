// src/components/Navbar.js
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navStyle = {
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    padding: "12px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily: "'Inter', sans-serif",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    color: location.pathname === path ? "#2563eb" : "#111827",
    paddingBottom: "4px",
    borderBottom:
      location.pathname === path ? "2px solid #2563eb" : "2px solid transparent",
    transition: "all 0.25s ease",
  });

  const logoutButtonStyle = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.25s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: "800", fontSize: "18px", color: "#111827" }}>
        Freelance<span style={{ color: "#2563eb" }}>Hub</span>
      </div>

      <div style={linkContainerStyle}>
        {role === "ADMIN" && (
          <>
            <Link to="/manage-users" style={linkStyle("/manage-users")}>
              Manage Users
            </Link>
            <Link to="/view-contracts" style={linkStyle("/view-contracts")}>
              Contracts
            </Link>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>
              Client Dashboard
            </Link>
            <Link to="/post-project" style={linkStyle("/post-project")}>
              Post Project
            </Link>
           
          </>
        )}

        {role === "CLIENT" && (
          <>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/post-project" style={linkStyle("/post-project")}>
              Post Project
            </Link>
            <Link to="/contracts" style={linkStyle("/contracts")}>
              Contracts
            </Link>
          </>
        )}

        {role === "FREELANCER" && (
          <>
            <Link
              to="/freelancer-dashboard"
              style={linkStyle("/freelancer-dashboard")}
            >
              Dashboard
            </Link>
            <Link to="/browse-projects" style={linkStyle("/browse-projects")}>
              Browse
            </Link>
            <Link to="/contracts" style={linkStyle("/contracts")}>
              Contracts
            </Link>
          </>
        )}

        <Link to="/profile" style={linkStyle("/profile")}>
          Profile
        </Link>
      </div>

      <button
        onClick={logout}
        style={logoutButtonStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = "#1d4ed8")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
      >
        Logout
      </button>
    </nav>
  );
}
