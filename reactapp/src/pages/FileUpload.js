import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FileUpload() {
  const { projectId, milestoneId } = useParams();
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchUploadedFiles();
  }, [projectId]);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/files/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUploadedFiles(res.data || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠ Please choose a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    setUploading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`✅ File "${res.data.fileName}" uploaded successfully!`);
      setFile(null);
      fetchUploadedFiles();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage(
        err.response?.data?.message ||
          "❌ Failed to upload file. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:8080/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑 File deleted successfully.");
      fetchUploadedFiles();
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("❌ Failed to delete file.");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "650px",
        margin: "50px auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#007bff" }}>
        Upload File for Milestone {milestoneId}
      </h2>

      <form
        onSubmit={handleUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          alignItems: "stretch",
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        {file && <p style={{ color: "#555" }}>📄 Selected: {file.name}</p>}

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "12px",
            backgroundColor: uploading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontWeight: "600",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) =>
            !uploading && (e.currentTarget.style.background = "#0056b3")
          }
          onMouseOut={(e) =>
            !uploading && (e.currentTarget.style.background = "#007bff")
          }
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#f0f4f8",
            color: "#333",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}

      <hr style={{ margin: "30px 0", borderColor: "#eee" }} />

      <h3 style={{ marginBottom: "20px", color: "#007bff" }}>Uploaded Files</h3>
      {uploadedFiles.length > 0 ? (
        <ul style={{ listStyle: "none", padding: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
          {uploadedFiles.map((f) => (
            <li
              key={f.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "8px",
                background: "#f9f9f9",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <a
                href={`http://localhost:8080/files/download/${f.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", fontWeight: "500", textDecoration: "none" }}
              >
                {f.fileName}
              </a>
              <button
                onClick={() => handleDelete(f.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#b02a37")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#dc3545")}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#555" }}>No files uploaded yet.</p>
      )}
    </div>
  );
}
