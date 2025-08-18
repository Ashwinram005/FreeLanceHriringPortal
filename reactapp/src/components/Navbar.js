// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navStyle = {
    background: "linear-gradient(90deg, #1f2937 0%, #1a1f2b 100%)",
    padding: "10px 25px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    borderBottom: "2px solid #111827",
    transition: "all 0.3s ease",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const linkStyle = {
    color: "#f1f5f9",
    textDecoration: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "all 0.25s ease",
    background: "transparent",
    transform: "scale(1)",
  };

  const logoutButtonStyle = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "7px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.25s ease",
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.background = "#3b82f6";
    e.currentTarget.style.boxShadow = "0 2px 10px rgba(59,130,246,0.5)";
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <nav style={navStyle}>
      <div style={linkContainerStyle}>
        {role === "ADMIN" && (
          <>
            <Link
              to="/manage-users"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/view-contracts"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              View Contracts
            </Link>
          </>
        )}

        {role === "CLIENT" && (
          <>
            <Link
              to="/dashboard"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Client Dashboard
            </Link>
            <Link
              to="/post-project"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Post Project
            </Link>
            <Link
              to="/contracts"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Contracts
            </Link>
          </>
        )}

        {role === "FREELANCER" && (
          <>
            <Link
              to="/freelancer-dashboard"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Freelancer Dashboard
            </Link>
            <Link
              to="/browse-projects"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Browse Projects
            </Link>
            <Link
              to="/contracts"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Contracts
            </Link>
          </>
        )}

        <Link
          to="/profile"
          style={linkStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Profile
        </Link>
      </div>

      <button
        onClick={logout}
        style={logoutButtonStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
      >
        Logout
      </button>
    </nav>
  );
}
