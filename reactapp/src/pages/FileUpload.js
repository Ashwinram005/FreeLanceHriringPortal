// src/pages/FileUpload.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaFileUpload, FaArrowLeft } from "react-icons/fa";

export default function FileUpload() {
  const { projectId, milestoneId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
      toast.error("Failed to fetch uploaded files.");
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    setUploading(true);

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
      toast.success(`File "${res.data.fileName}" uploaded successfully!`);
      setFile(null);
      fetchUploadedFiles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (fileObj) => {
    setSelectedFile(fileObj);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/files/${selectedFile.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("File deleted successfully!");
      fetchUploadedFiles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file.");
    } finally {
      setDeleteModalOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <Toaster position="top-right" />

      {/* Upload Card */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 flex flex-col gap-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
          <FaFileUpload /> Upload File for Milestone {milestoneId}
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {file && (
            <p className="text-gray-700 font-medium">📄 Selected: {file.name}</p>
          )}
          <button
            type="submit"
            disabled={uploading}
            className={`p-3 rounded-lg text-white font-semibold transition-colors ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Uploaded Files */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Uploaded Files
          </h3>
          {uploadedFiles.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {uploadedFiles.map((f) => (
                <li
                  key={f.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <a
                    href={`http://localhost:8080/files/download/${f.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {f.fileName}
                  </a>
                  <button
                    onClick={() => confirmDelete(f)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No files uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">Delete File</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedFile.fileName}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
