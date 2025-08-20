// src/components/Header.js
import React from "react";

export default function Header() {
  const headerWrapper = {
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "#fff",
    padding: "60px 20px",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: "30px",
    borderBottomRightRadius: "30px",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "10px",
  };

  const subTextStyle = {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "6px",
    color: "rgba(255,255,255,0.9)",
  };

  const taglineStyle = {
    fontSize: "15px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "8px",
  };

  return (
    <header style={headerWrapper}>
      <div style={titleStyle}>✨ FreelanceHub</div>
      <div style={subTextStyle}>Where Projects Meet Talent</div>
      <div style={taglineStyle}>
        Post, Browse, and Collaborate — all in one platform.
      </div>
    </header>
  );
}
