import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const userId = parseInt(localStorage.getItem("userId")); // ensure it's a number

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resUsers = await axios.get("http://localhost:8080/api/auth/users");
        const currentUser = resUsers.data.find(u => u.id === userId);
        setUser(currentUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;

  const containerStyle = {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    background: "#f8f9fa",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  };

  const headingStyle = {
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#333",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px"
  };

  const infoStyle = {
    fontSize: "1.1rem",
    color: "#555",
    margin: "10px 0",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Profile</h1>
      <p style={infoStyle}><strong>Name:</strong> {user.name}</p>
      <p style={infoStyle}><strong>Email:</strong> {user.email}</p>
      <p style={infoStyle}><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
