import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Milestones() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [contractId, setContractId] = useState(null);
  const [contractStatus, setContractStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMilestones();
  }, [projectId, token]);

  const fetchMilestones = () => {
    axios
      .get(`http://localhost:8080/milestones/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMilestones(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/contracts/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setContractId(res.data.id);
          setContractStatus(res.data.status);
        }
      })
      .catch((err) => console.error(err));
  }, [projectId, token]);

  const handleContractStatusChange = (newStatus) => {
    setContractStatus(newStatus);
    if (!contractId) return;
    axios
      .put(
        `http://localhost:8080/contracts/${contractId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err) => console.error(err));
  };

  const handleMilestoneStatusChange = (milestoneId, newStatus) => {
    axios
      .put(
        `http://localhost:8080/milestones/${milestoneId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === milestoneId ? { ...m, status: newStatus } : m
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!contractId) {
      alert("No contract found for this project. Cannot add milestone.");
      return;
    }
    axios
      .post(
        "http://localhost:8080/milestones",
        { contractId, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMilestones([...milestones, res.data]);
        setDescription("");
        setStatus("PENDING");
        setShowForm(false);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteMilestone = (id) => {
    if (!window.confirm("Are you sure you want to delete this milestone?"))
      return;
    axios
      .delete(`http://localhost:8080/milestones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteFile = (milestoneId) => {
    axios
      .delete(`http://localhost:8080/milestones/${milestoneId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) => (m.id === milestoneId ? { ...m, fileName: null } : m))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#007bff" }}>
        Milestones for Project {projectId}
      </h2>

      {contractStatus && (
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>
            Contract Status:
          </label>
          <select
            value={contractStatus}
            onChange={(e) => handleContractStatusChange(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        {showForm ? "Cancel" : "Add Milestone"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAddMilestone}
          style={{
            marginBottom: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Milestone description..."
            style={{
              width: "100%",
              minHeight: "70px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "150px",
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "120px",
            }}
          >
            Save Milestone
          </button>
        </form>
      )}

      {milestones.length === 0 ? (
        <p style={{ color: "#555" }}>No milestones yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {milestones.map((m) => (
            <div
              key={m.id}
              style={{
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p style={{ fontSize: "16px", fontWeight: "500" }}>{m.description}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "500" }}>Status:</label>
                <select
                  value={m.status}
                  onChange={(e) =>
                    handleMilestoneStatusChange(m.id, e.target.value)
                  }
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() =>
                    navigate(`/projects/${projectId}/milestones/${m.id}/upload`)
                  }
                  style={{
                    padding: "8px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Upload File
                </button>

                {m.fileName && (
                  <button
                    onClick={() => handleDeleteFile(m.id)}
                    style={{
                      padding: "8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete File
                  </button>
                )}

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  style={{
                    padding: "8px",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete Milestone
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
