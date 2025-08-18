import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate

export default function ManageUsers() {
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [admins, setAdmins] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Hook for navigation

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/auth/users");
      const allUsers = res.data;

      setClients(allUsers.filter(user => user.role.toUpperCase() === "CLIENT"));
      setFreelancers(allUsers.filter(user => user.role.toUpperCase() === "FREELANCER"));
      setAdmins(allUsers.filter(user => user.role.toUpperCase() === "ADMIN")); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/auth/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const renderUserList = (users) =>
    users.length === 0 ? (
      <p style={{ color: "#666" }}>No users found.</p>
    ) : (
      <div style={styles.userList}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <p style={styles.userName}>{user.name}</p>
            <p style={styles.userEmail}>{user.email}</p>
            <p style={styles.userRole}>{user.role}</p>
            <button
              style={styles.viewButton}
              onClick={() => navigate(`/profile/${user.id}`)} // ✅ Redirect
            >
              View Profile
            </button>
            <button
              style={styles.deleteButton}
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading users...</p>;

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.sectionTitle, marginTop: "40px" }}>Admins</h1>
      {renderUserList(admins)}
      
      <h1 style={styles.sectionTitle}>Clients</h1>
      {renderUserList(clients)}

      <h1 style={{ ...styles.sectionTitle, marginTop: "40px" }}>Freelancers</h1>
      {renderUserList(freelancers)}

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sectionTitle: {
    fontSize: "24px",
    color: "#333",
    borderBottom: "2px solid #007BFF",
    paddingBottom: "6px",
  },
  userList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  userCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
  },
  userName: {
    fontWeight: "600",
    color: "#007BFF",
    marginBottom: "5px",
  },
  userEmail: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "5px",
  },
  userRole: {
    color: "#777",
    fontSize: "12px",
    marginBottom: "10px",
  },
  viewButton: {
    padding: "5px 10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteButton: {
    padding: "5px 10px",
    background: "#FF4C4C",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
