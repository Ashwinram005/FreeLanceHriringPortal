import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("COMPLETED_FIRST"); 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        let url = "";
        if (role === "CLIENT")
          url = `http://localhost:8080/contracts/client/${userId}`;
        if (role === "FREELANCER")
          url = `http://localhost:8080/contracts/freelancer/${userId}`;

        const response = await axios.get(url, {
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
  }, [role, userId, token]);

  // Delete contract
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;

    try {
      await axios.delete(`http://localhost:8080/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted contract from state
      setContracts(prev => prev.filter(contract => contract.id !== id));
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to delete contract");
    }
  };

  // Sorting contracts
  const sortedContracts = [...contracts].sort((a, b) => {
    let order;
    if (sortOption === "COMPLETED_FIRST") {
      order = { COMPLETED: 0, PENDING: 1 };
    } else {
      order = { PENDING: 0, COMPLETED: 1 };
    }
    return order[a.status] - order[b.status];
  });

  // Pagination
  const totalPages = Math.ceil(sortedContracts.length / pageSize);
  const displayedContracts = sortedContracts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading contracts...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center", marginTop: "40px" }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Contracts</h2>

      {/* Sorting dropdown */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="sort" style={{ marginRight: "10px" }}>Sort by Status:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "4px" }}
        >
          <option value="COMPLETED_FIRST">Completed First</option>
          <option value="PENDING_FIRST">Pending First</option>
        </select>
      </div>

      {displayedContracts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No approved projects/contracts yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
          {displayedContracts.map((contract) => (
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
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#444" }}>
                  Project ID: <span style={{ fontWeight: "normal", color: "#666" }}>{contract.proposalId}</span>
                </p>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#444" }}>
                  Status:{" "}
                  <span style={{ fontWeight: "normal", color: contract.status === "COMPLETED" ? "#28a745" : "#ffc107" }}>
                    {contract.status}
                  </span>
                </p>
              </div>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(contract.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              marginRight: "10px",
              borderRadius: "5px",
              border: "1px solid #007bff",
              backgroundColor: "#fff",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              marginLeft: "10px",
              borderRadius: "5px",
              border: "1px solid #007bff",
              backgroundColor: "#fff",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
