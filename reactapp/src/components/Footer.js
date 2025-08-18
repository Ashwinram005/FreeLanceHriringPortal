// src/components/Footer.js
import React from "react";

export default function Footer() {
  const footerStyle = {
    background: "#1f2937", // dark background to match header/navbar
    color: "#f1f5f9",
    textAlign: "center",
    padding: "15px 10px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.2)",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    position: "relative",
  };

  const linkStyle = {
    color: "#3b82f6",
    textDecoration: "none",
    margin: "0 5px",
  };

  return (
    <footer style={footerStyle}>
      &copy; {new Date().getFullYear()} My Freelance Platform. All rights reserved.{" "}
      <a href="/privacy" style={linkStyle}>Privacy Policy</a> |{" "}
      <a href="/terms" style={linkStyle}>Terms of Service</a>
    </footer>
  );
}
