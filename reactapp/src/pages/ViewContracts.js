// src/pages/ViewContracts.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/contracts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(response.data);
      } catch (err) {
        console.error(err.response || err);
        setError("Failed to fetch contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [token]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading contracts...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "40px" }}>{error}</p>;

  return (
    <div style={{
      maxWidth: "900px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>All Contracts</h2>
      {contracts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No contracts found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
          {contracts.map((contract) => (
            <li
              key={contract.id}
              style={{
                padding: "15px 20px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#444" }}>
                  Contract ID: <span style={{ fontWeight: "normal", color: "#666" }}>{contract.id}</span>
                </p>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#444" }}>
                  Proposal ID: <span style={{ fontWeight: "normal", color: "#666" }}>{contract.proposalId}</span>
                </p>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#444" }}>
                  Status: <span style={{ fontWeight: "normal", color: contract.status === "COMPLETED" ? "#28a745" : "#ffc107" }}>
                    {contract.status}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
