import React, { useState } from "react";
import axios from "axios";

export default function PostProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    minBudget: "",
    maxBudget: "",
    deadline: "",
    skills: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const clientId = Number(localStorage.getItem("userId"));
    if (!token) return setMessage("You are not logged in!");
    if (!clientId) return setMessage("User ID not found!");

    const projectData = {
      ...formData,
      clientId,
      minBudget: Number(formData.minBudget),
      maxBudget: Number(formData.maxBudget),
      skills: formData.skills.split(",").map((s) => s.trim()),
      deadline: new Date(formData.deadline).toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Your idea has been posted successfully!");
      setFormData({ title: "", description: "", minBudget: "", maxBudget: "", deadline: "", skills: "" });
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("Error posting your idea. Check console for details.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "60px 20px",
      background: "linear-gradient(135deg, #f0f4ff 0%, #d9e6ff 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
        padding: "40px 30px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "28px", marginBottom: "15px", color: "#1a1a2e" }}>
          Share Your Idea 💡
        </h2>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Describe your project idea and invite talented freelancers to bring it to life!
        </p>

        {message && <p style={{ color: "#333", marginBottom: "20px" }}>{message}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #cfd8dc",
              fontSize: "16px",
              transition: "all 0.3s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#4caf50"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#cfd8dc"}
          />
          <textarea
            name="description"
            placeholder="Describe your idea..."
            value={formData.description}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #cfd8dc",
              fontSize: "16px",
              minHeight: "120px",
              transition: "all 0.3s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#4caf50"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#cfd8dc"}
          />
          <div style={{ display: "flex", gap: "15px" }}>
            <input
              type="number"
              name="minBudget"
              placeholder="Min Budget"
              value={formData.minBudget}
              onChange={handleChange}
              required
              style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid #cfd8dc", fontSize: "16px" }}
            />
            <input
              type="number"
              name="maxBudget"
              placeholder="Max Budget"
              value={formData.maxBudget}
              onChange={handleChange}
              required
              style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid #cfd8dc", fontSize: "16px" }}
            />
          </div>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={{ padding: "14px", borderRadius: "10px", border: "1px solid #cfd8dc", fontSize: "16px" }}
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills required (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            required
            style={{ padding: "14px", borderRadius: "10px", border: "1px solid #cfd8dc", fontSize: "16px" }}
          />

          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fff",
              background: "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "linear-gradient(90deg, #43a047 0%, #5aa65b 100%)"}
            onMouseOut={(e) => e.currentTarget.style.background = "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)"}
          >
            Post Your Idea
          </button>
        </form>
      </div>
    </div>
  );
}
