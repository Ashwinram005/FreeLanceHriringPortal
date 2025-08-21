  // src/pages/Dashboard.js
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";

  export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortOption, setSortOption] = useState("deadlineAsc");
    const [statusSort, setStatusSort] = useState("");
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

    // Badge styles
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

    // Sorting
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

    if (loading)
      return (
        <p className="text-center text-lg text-gray-500 mt-10 animate-pulse">
          Loading projects...
        </p>
      );
    if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 p-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-3xl font-extrabold text-center drop-shadow">
           📊 Your Posted Projects
          </h2>
          <p className="text-center mt-2 text-indigo-100">
            Manage, track, and update your projects with ease
          </p>
        </div>

        {/* Sorting Options */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div>
            <label className="mr-2 font-medium text-gray-700">Sort By:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="deadlineAsc">Deadline ↑ (Earliest first)</option>
              <option value="deadlineDesc">Deadline ↓ (Latest first)</option>
              <option value="budgetAsc">Budget ↑ (Lowest first)</option>
              <option value="budgetDesc">Budget ↓ (Highest first)</option>
            </select>
          </div>

          <div>
            <label className="mr-2 font-medium text-gray-700">
              Sort by Status:
            </label>
            <select
              value={statusSort}
              onChange={(e) => setStatusSort(e.target.value)}
              className="p-2 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">None</option>
              <option value="statusAsc">OPEN → CLOSED</option>
              <option value="statusDesc">CLOSED → OPEN</option>
            </select>
          </div>
        </div>

        {/* Projects List */}
        {displayedProjects.length === 0 ? (
          <p className="text-center text-gray-500">No projects posted yet.</p>
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
                  <label className="mr-2 font-medium text-gray-700">Status:</label>
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
