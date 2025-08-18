import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CreateContract() {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const proposalId = searchParams.get("proposalId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/contracts",
        { proposalId, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Contract created successfully!");
      navigate("/freelancer/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create contract.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#f4f6f8",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#333",
        }}
      >
        Create Contract
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor: "#fff",
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
