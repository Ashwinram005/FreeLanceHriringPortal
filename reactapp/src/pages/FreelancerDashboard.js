import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FreelancerDashboard() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("ACCEPTED_FIRST"); // dropdown selection
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const freelancerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      setError("You are not logged in!");
      setLoading(false);
      return;
    }

    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/proposal/freelancer/${freelancerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const enriched = await Promise.all(
          response.data.map(async (proposal) => {
            const projectRes = await axios.get(
              `http://localhost:8080/projects/${proposal.projectId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...proposal, project: projectRes.data };
          })
        );

        setProposals(enriched);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [token, freelancerId]);

  // Sorting by status based on dropdown
  const sortedProposals = [...proposals].sort((a, b) => {
    let order;
    switch (sortOption) {
      case "ACCEPTED_FIRST":
        order = { ACCEPTED: 0, REJECTED: 1, PENDING: 2 };
        break;
      case "PENDING_FIRST":
        order = { PENDING: 0, REJECTED: 1, ACCEPTED: 2 };
        break;
      case "REJECTED_FIRST":
        order = { REJECTED: 0, PENDING: 1, ACCEPTED: 2 };
        break;
      default:
        order = { ACCEPTED: 0, REJECTED: 1, PENDING: 2 };
    }
    return order[a.status] - order[b.status];
  });

  // Pagination
  const totalPages = Math.ceil(sortedProposals.length / pageSize);
  const displayedProposals = sortedProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Projects</h2>

      {/* Sorting dropdown + Pagination in one row */}
      {totalPages > 1 ? (
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Sorting dropdown */}
          <div>
            <label htmlFor="sort" style={{ marginRight: "10px" }}>
              Sort by Status:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "4px" }}
            >
              <option value="ACCEPTED_FIRST">Accepted First</option>
              <option value="PENDING_FIRST">Pending First</option>
              <option value="REJECTED_FIRST">Rejected First</option>
            </select>
          </div>

          {/* Pagination controls (top right) */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        // Only sorting if no pagination needed
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="sort" style={{ marginRight: "10px" }}>
            Sort by Status:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "4px" }}
          >
            <option value="ACCEPTED_FIRST">Accepted First</option>
            <option value="PENDING_FIRST">Pending First</option>
            <option value="REJECTED_FIRST">Rejected First</option>
          </select>
        </div>
      )}

      {displayedProposals.length === 0 ? (
        <p>No proposals submitted yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayedProposals.map((proposal) => (
            <li
              key={proposal.id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{proposal.project.title}</h3>
              <p>
                <strong>Description:</strong> {proposal.project.description}
              </p>
              <p>
                <strong>Budget:</strong> {proposal.project.minBudget} -{" "}
                {proposal.project.maxBudget}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(proposal.project.deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Skills:</strong> {proposal.project.skills.join(", ")}
              </p>
              <p>
                <strong>Bid Amount:</strong> {proposal.bidAmount}
              </p>
              <p>
                <strong>Status:</strong> {proposal.status}
              </p>

              {proposal.status === "ACCEPTED" && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/milestones/${proposal.projectId}`)}
                  >
                    View More
                  </button>

                  <button
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/contracts/create?proposalId=${proposal.id}`)
                    }
                  >
                    Create Contract
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination controls (bottom center) */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
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
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
