// src/pages/Proposals.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Proposals() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/proposal/client/${localStorage.getItem("userId")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const filtered = response.data.filter(
          (p) => p.projectId === parseInt(projectId)
        );
        setProposals(filtered);
      } catch (err) {
        console.error(err.response || err);
        setError("Error fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [projectId, token]);

  const sortedProposals = [...proposals].sort((a, b) =>
    sortAsc ? a.bidAmount - b.bidAmount : b.bidAmount - a.bidAmount
  );

  const totalPages = Math.ceil(sortedProposals.length / pageSize);
  const displayedProposals = sortedProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const updateProposalStatus = async (proposalId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/proposal/${proposalId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === "ACCEPTED") {
        await axios.put(
          `http://localhost:8080/projects/${projectId}/status`,
          { status: "IN_PROGRESS" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.post(
          `http://localhost:8080/contracts`,
          {
            proposalId,
            description: "Contract for accepted proposal",
            status: "PENDING",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to update proposal status");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading proposals...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-md">
          Project Proposals
        </h2>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all"
        >
          Sort by Bid ({sortAsc ? "Asc" : "Desc"})
        </button>
      </div>

      {displayedProposals.length === 0 ? (
        <p className="text-gray-600 text-center">
          No proposals yet for this project.
        </p>
      ) : (
        <div className="space-y-6">
          {displayedProposals.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Freelancer ID: {p.freelancerId}
                  </p>
                  <button
                    onClick={() => navigate(`/profile/${p.freelancerId}`)}
                    className="mt-2 inline-block px-3 py-1 text-sm rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                  >
                    View Profile
                  </button>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    p.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : p.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="mt-4 text-gray-700">
                <strong>Bid Amount:</strong>{" "}
                <span className="text-indigo-600 font-bold">${p.bidAmount}</span>
              </p>

              {/* Action Buttons */}
              {p.status === "PENDING" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => updateProposalStatus(p.id, "ACCEPTED")}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white shadow hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateProposalStatus(p.id, "REJECTED")}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white shadow hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
