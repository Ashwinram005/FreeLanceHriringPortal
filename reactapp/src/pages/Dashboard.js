// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaFolderOpen,
  FaTasks,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const pageSize = 4;

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
          `https://freelancehriringportal.onrender.com/projects/client/${clientId}`,
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
        `https://freelancehriringportal.onrender.com/projects/${projectId}/status`,
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

  const getStatusClasses = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-700 border border-green-300 shadow-sm";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-sm";
      case "CLOSED":
        return "bg-red-100 text-red-700 border border-red-300 shadow-sm";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  // Apply search and filter
  const filteredProjects = projects
    .filter((p) => (filterStatus === "ALL" ? true : p.status === filterStatus))
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Summary Data
  const totalCount = projects.length;
  const openCount = projects.filter((p) => p.status === "OPEN").length;
  const inProgressCount = projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const closedCount = projects.filter((p) => p.status === "CLOSED").length;

  if (loading)
    return (
      <p className="text-center text-lg text-gray-500 mt-10 animate-pulse">
        Loading projects...
      </p>
    );
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3 text-indigo-600">
            <FaLayerGroup size={24} />
            <h3 className="text-lg font-semibold">Total Projects</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3 text-green-600">
            <FaFolderOpen size={24} />
            <h3 className="text-lg font-semibold">Open Projects</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{openCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3 text-yellow-600">
            <FaTasks size={24} />
            <h3 className="text-lg font-semibold">In Progress</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{inProgressCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3 text-red-600">
            <FaCheckCircle size={24} />
            <h3 className="text-lg font-semibold">Closed</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{closedCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {displayedProjects.length === 0 ? (
        <p className="text-center text-gray-500">No projects found.</p>
      ) : (
        <ul className="space-y-6">
          {displayedProjects.map((project) => (
            <li
              key={project.id}
              className="bg-white/90 p-6 rounded-xl border shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClasses(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <p className="mt-3 text-gray-600 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <p>
                  <strong>💰 Budget:</strong> {project.minBudget} -{" "}
                  {project.maxBudget}
                </p>
                <p>
                  <strong>⏳ Deadline:</strong>{" "}
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
                <p className="col-span-2">
                  <strong>🛠 Skills:</strong> {project.skills.join(", ")}
                </p>
              </div>

              {/* Status Dropdown */}
              <div className="mt-4">
                <label className="mr-2 font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={project.status}
                  onChange={(e) =>
                    handleStatusChange(project.id, e.target.value)
                  }
                  className="p-2 border rounded-lg bg-white shadow focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => viewProposals(project.id)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow hover:from-indigo-700 hover:to-blue-700 transition"
                >
                  View Proposals
                </button>
                <button
                  onClick={() => viewMoreDetails(project.id)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition"
                >
                  Milestones
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white border rounded-lg shadow hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white border rounded-lg shadow hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
