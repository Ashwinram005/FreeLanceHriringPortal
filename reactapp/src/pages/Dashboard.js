import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("deadlineAsc"); // default main sort
  const [statusSort, setStatusSort] = useState(""); // secondary status sort
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const clientId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!clientId || !token) {
      
      setError("Client not logged in!");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/projects/client/${clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [clientId, token]);

  const viewProposals = (projectId) => navigate(`/proposals/${projectId}`);
  const viewMoreDetails = (projectId) => navigate(`/milestones/${projectId}`);

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/projects/${projectId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "OPEN":
        return { border: "2px solid #3b82f6", background: "#e0f2fe" };
      case "IN_PROGRESS":
        return { border: "2px solid #f59e0b", background: "#fef3c7" };
      case "CLOSED":
        return { border: "2px solid #6b7280", background: "#f3f4f6" };
      default:
        return { border: "1px solid #ccc", background: "#fff" };
    }
  };

  // =======================
  // Sorting logic
  // =======================
  let sortedProjects = [...projects].sort((a, b) => {
    switch (sortOption) {
      case "budgetAsc":
        return a.minBudget - b.minBudget;
      case "budgetDesc":
        return b.minBudget - a.minBudget;
      case "deadlineAsc":
        return new Date(a.deadline) - new Date(b.deadline);
      case "deadlineDesc":
        return new Date(b.deadline) - new Date(a.deadline);
      default:
        return 0;
    }
  });

  // Apply status sort if selected
  if (statusSort) {
    const order = { OPEN: 1, IN_PROGRESS: 2, CLOSED: 3 };
    sortedProjects.sort((a, b) =>
      statusSort === "statusAsc"
        ? order[a.status] - order[b.status]
        : order[b.status] - order[a.status]
    );
  }

  const totalPages = Math.ceil(sortedProjects.length / pageSize);
  const displayedProjects = sortedProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Posted Projects</h2>

      {/* Sorting Dropdowns */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <div>
          <label style={{ marginRight: "10px" }}>Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: "5px", borderRadius: "4px" }}
          >
            <option value="deadlineAsc">Deadline ↑ (Earliest first)</option>
            <option value="deadlineDesc">Deadline ↓ (Latest first)</option>
            <option value="budgetAsc">Budget ↑ (Lowest first)</option>
            <option value="budgetDesc">Budget ↓ (Highest first)</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: "10px" }}>Sort by Status:</label>
          <select
            value={statusSort}
            onChange={(e) => setStatusSort(e.target.value)}
            style={{ padding: "5px", borderRadius: "4px" }}
          >
            <option value="">None</option>
            <option value="statusAsc">OPEN → CLOSED</option>
            <option value="statusDesc">CLOSED → OPEN</option>
          </select>
        </div>
      </div>

      {displayedProjects.length === 0 ? (
        <p>No projects posted yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayedProjects.map((project) => (
            <li
              key={project.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                borderRadius: "8px",
                ...getStatusStyles(project.status),
              }}
            >
              <h3>{project.title}</h3>
              <p><strong>Description:</strong> {project.description}</p>
              <p>
                <strong>Budget:</strong> {project.minBudget} - {project.maxBudget}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Skills:</strong> {project.skills.join(", ")}
              </p>

              <div>
                <strong>Status:</strong>{" "}
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                  style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <button
                onClick={() => viewProposals(project.id)}
                style={{ marginTop: "10px", padding: "5px 10px", marginRight: "10px" }}
              >
                View Proposals
              </button>

              <button
                onClick={() => viewMoreDetails(project.id)}
                style={{ marginTop: "10px", padding: "5px 10px" }}
              >
                View More Details
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ marginRight: "5px", padding: "5px 10px" }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ marginLeft: "5px", padding: "5px 10px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
