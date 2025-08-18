import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmounts, setBidAmounts] = useState({});
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const freelancerId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("You are not logged in!");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleBidChange = (projectId, value) => {
    setBidAmounts({ ...bidAmounts, [projectId]: value });
  };

  const submitProposal = async (projectId) => {
    const bidAmount = bidAmounts[projectId];
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      setMessage("Please enter a valid bid amount.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/proposal",
        {
          projectId,
          freelancerId: Number(freelancerId),
          bidAmount: Number(bidAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Proposal submitted successfully!");
      setBidAmounts({ ...bidAmounts, [projectId]: "" });
    } catch (err) {
      console.error(err.response || err);
      setMessage("Error submitting proposal. Maybe you already submitted one.");
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px", color: "#111827" }}>
        Browse Projects
      </h2>

      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px 15px",
          marginBottom: "20px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          fontSize: "14px",
        }}
      />

      {message && (
        <p
          style={{
            color: "green",
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}

      {filteredProjects.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          No projects available at the moment.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredProjects.map((project) => (
            <li
              key={project.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #e5e7eb",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                })
              }
            >
              <h3 style={{ marginBottom: "8px", color: "#1f2937" }}>{project.title}</h3>
              <p style={{ marginBottom: "5px" }}>
                <strong>Description:</strong> {project.description}
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Budget:</strong> {project.minBudget} - {project.maxBudget}
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Deadline:</strong>{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Skills:</strong> {project.skills.join(", ")}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Status:</strong> {project.status}
              </p>

              <button
                onClick={() => navigate(`/profile/${project.clientId}`)}
                style={{
                  padding: "6px 12px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "10px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  Object.assign(e.currentTarget.style, {
                    background: "#2563eb",
                    transform: "scale(1.05)",
                  })
                }
                onMouseOut={(e) =>
                  Object.assign(e.currentTarget.style, {
                    background: "#3b82f6",
                    transform: "scale(1)",
                  })
                }
              >
                View Client Profile
              </button>

              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Your bid"
                  value={bidAmounts[project.id] || ""}
                  onChange={(e) => handleBidChange(project.id, e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    width: "120px",
                  }}
                />
                <button
                  onClick={() => submitProposal(project.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) =>
                    Object.assign(e.currentTarget.style, {
                      background: "#059669",
                      transform: "scale(1.05)",
                    })
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.currentTarget.style, {
                      background: "#10b981",
                      transform: "scale(1)",
                    })
                  }
                >
                  Submit Proposal
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
