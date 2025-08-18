import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Proposals() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/proposal/client/${localStorage.getItem("userId")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const filtered = response.data.filter(
          (p) => p.projectId === parseInt(projectId)
        );
        setProposals(filtered);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [projectId, token]);

  const sortedProposals = [...proposals].sort((a, b) =>
    sortAsc ? a.bidAmount - b.bidAmount : b.bidAmount - a.bidAmount
  );

  const totalPages = Math.ceil(sortedProposals.length / pageSize);
  const displayedProposals = sortedProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const updateProposalStatus = async (proposalId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/proposal/${proposalId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === "ACCEPTED") {
        await axios.put(
          `http://localhost:8080/projects/${projectId}/status`,
          { status: "IN_PROGRESS" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.post(
          `http://localhost:8080/contracts`,
          {
            proposalId,
            description: "Contract for accepted proposal",
            status: "PENDING",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to update proposal status");
    }
  };

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Project Proposals</h2>
      <button
        onClick={() => setSortAsc(!sortAsc)}
        style={{ marginBottom: "15px", padding: "5px 10px" }}
      >
        Sort by Bid Amount ({sortAsc ? "Asc" : "Desc"})
      </button>

      {displayedProposals.length === 0 ? (
        <p>No proposals yet for this project.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayedProposals.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
              }}
            >
              <p>
                <strong>Freelancer ID:</strong> {p.freelancerId}{" "}
                <button
                  onClick={() => navigate(`/profile/${p.freelancerId}`)}
                  style={{
                    marginLeft: "10px",
                    padding: "3px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#3b82f6")
                  }
                >
                  View Profile
                </button>
              </p>
              <p>
                <strong>Bid Amount:</strong> {p.bidAmount}
              </p>
              <p>
                <strong>Status:</strong> {p.status}
              </p>
              {p.status === "PENDING" && (
                <>
                  <button
                    onClick={() => updateProposalStatus(p.id, "ACCEPTED")}
                    style={{ marginRight: "10px", padding: "5px 10px" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateProposalStatus(p.id, "REJECTED")}
                    style={{ padding: "5px 10px" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ marginRight: "5px" }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{ marginLeft: "5px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
