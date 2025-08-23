import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaFileContract,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

export default function FreelancerDashboard() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 4;

  const token = localStorage.getItem("token");
  const freelancerId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      setError("You are not logged in!");
      setLoading(false);
      return;
    }

    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `https://freelancehriringportal.onrender.com/proposal/freelancer/${freelancerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const enriched = await Promise.all(
          response.data.map(async (proposal) => {
            const projectRes = await axios.get(
              `https://freelancehriringportal.onrender.com/projects/${proposal.projectId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...proposal, project: projectRes.data };
          })
        );

        setProposals(enriched);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [token, freelancerId, navigate]);

  // Filter & search
  const filteredProposals = proposals
    .filter((p) => filterStatus === "ALL" || p.status === filterStatus)
    .filter((p) =>
      p.project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(filteredProposals.length / pageSize);
  const displayedProposals = filteredProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading proposals...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Summary counts
  const total = proposals.length;
  const accepted = proposals.filter((p) => p.status === "ACCEPTED").length;
  const pending = proposals.filter((p) => p.status === "PENDING").length;
  const rejected = proposals.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-8 flex justify-center items-center gap-3">
          My Projects
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={<FaFileContract size={28} />}
            label="Total Proposals"
            count={total}
            color="from-indigo-500 to-purple-500"
          />
          <SummaryCard
            icon={<FaCheckCircle size={28} />}
            label="Accepted"
            count={accepted}
            color="from-green-400 to-emerald-500"
          />
          <SummaryCard
            icon={<FaHourglassHalf size={28} />}
            label="Pending"
            count={pending}
            color="from-yellow-400 to-orange-400"
          />
          <SummaryCard
            icon={<FaTimesCircle size={28} />}
            label="Rejected"
            count={rejected}
            color="from-red-400 to-rose-500"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">All Status</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Proposals */}
        {displayedProposals.length === 0 ? (
          <p className="text-center text-gray-500 font-medium">
            No projects found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {displayedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {proposal.project.title}
                  </h3>
                  <p className="text-gray-600">
                    {proposal.project.description}
                  </p>
                  <p className="text-gray-700">
                    <strong>Budget:</strong> {proposal.project.minBudget} -{" "}
                    {proposal.project.maxBudget}
                  </p>
                  <p className="text-gray-700">
                    <strong>Deadline:</strong>{" "}
                    {new Date(proposal.project.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Skills:</strong>{" "}
                    {proposal.project.skills.join(", ")}
                  </p>
                  <p
                    className={`font-semibold ${
                      proposal.status === "ACCEPTED"
                        ? "text-green-600"
                        : proposal.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {proposal.status}
                  </p>
                  <p>
                    <strong>Bid Amount:</strong> ${proposal.bidAmount}
                  </p>
                </div>

                {proposal.status === "ACCEPTED" && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        navigate(`/milestones/${proposal.projectId}`)
                      }
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                      Milestones
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/contracts/create?proposalId=${proposal.id}`)
                      }
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                      Create Contract
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-blue-500 text-blue-500 disabled:opacity-50"
            >
              <FaArrowLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg border ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-blue-500 border-blue-500"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-blue-500 text-blue-500 disabled:opacity-50"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, label, count, color }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center hover:scale-105 transform transition`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold">{count}</h3>
    </div>
  );
}
