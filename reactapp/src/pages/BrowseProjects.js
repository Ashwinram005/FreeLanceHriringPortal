import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch, FaUser } from "react-icons/fa";

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

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
        const response = await axios.get("https://freelancehriringportal.onrender.com/projects", {
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

  const openProposalModal = (project) => {
    setSelectedProject(project);
    setBidAmount("");
    setModalOpen(true);
  };

  const submitProposal = async () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    try {
      await axios.post(
        "https://freelancehriringportal.onrender.com/proposal",
        {
          projectId: selectedProject.id,
          freelancerId: Number(freelancerId),
          bidAmount: Number(bidAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Proposal submitted successfully!");
      setModalOpen(false);
    } catch (err) {
      console.error(err.response || err);
      toast.error(
        "Error submitting proposal. Maybe you already submitted one."
      );
      setModalOpen(false); // 🔥 close modal if error
    }
  };

  // filtering
  const filteredProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) =>
      filterStatus === "ALL" ? true : project.status === filterStatus
    );

  // pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading projects...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6 flex justify-center items-center gap-2">
          <FaUser className="text-blue-500" /> Browse Projects
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 font-medium">
            No projects match the selected filter or search.
          </p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-gray-700">
                      <strong>Budget:</strong> {project.minBudget} -{" "}
                      {project.maxBudget}
                    </p>
                    <p className="text-gray-700">
                      <strong>Deadline:</strong>{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <strong>Skills:</strong> {project.skills.join(", ")}
                    </p>
                    <p
                      className={`font-semibold ${
                        project.status === "CLOSED"
                          ? "text-red-600"
                          : project.status === "IN_PROGRESS"
                          ? "text-yellow-500"
                          : "text-green-600"
                      }`}
                    >
                      {project.status}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      onClick={() => openProposalModal(project)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                      Submit Proposal
                    </button>
                    <button
                      onClick={() => navigate(`/profile/${project.clientId}`)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                      View Client Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Proposal Modal */}
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
            <p className="mb-4 text-gray-700">{selectedProject.description}</p>
            <p className="mb-4">
              <strong>Budget:</strong> {selectedProject.minBudget} -{" "}
              {selectedProject.maxBudget}
            </p>
            <input
              type="number"
              placeholder="Enter your bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitProposal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
