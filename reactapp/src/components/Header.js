// src/components/Header.js
import React from "react";

export default function Header() {
  const headerStyle = {
    background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
    color: "#fff",
    padding: "15px 15px",          // reduced padding
    textAlign: "center",
    fontSize: "20px",              // smaller font
    fontWeight: "700",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)", // lighter shadow
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    position: "relative",
    overflow: "hidden",
    animation: "slideDown 0.8s ease-out",
  };

  const subTextStyle = {
    fontSize: "14px",              // smaller subtext
    fontWeight: "400",
    marginTop: "4px",
    fontStyle: "italic",
    color: "#f0f0f0",
    opacity: 0,
    animation: "fadeIn 1s 0.5s forwards",
  };

  const taglineStyle = {
    fontSize: "12px",              // smaller tagline
    marginTop: "3px",
    color: "#d1d5db",
    fontStyle: "normal",
    opacity: 0,
    animation: "fadeIn 1s 1s forwards",
  };

  return (
    <header style={headerStyle}>
      My Freelance Platform
      <div style={subTextStyle}>Where projects meet talent!</div>
      <div style={taglineStyle}>
        Discover opportunities and grow your career.
      </div>

      {/* Keyframes for animations */}
      <style>
        {`
          @keyframes slideDown {
            0% { transform: translateY(-40px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}
      </style>
    </header>
  );
}
