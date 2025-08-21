// src/pages/ViewContracts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileContract,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ViewContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/contracts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(response.data);
      } catch (err) {
        setError("Failed to fetch contracts");
        toast.error("Failed to fetch contracts");
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [token]);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.id.toString().includes(searchTerm) ||
      c.proposalId.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "ALL" || c.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / pageSize);
  const displayedContracts = filteredContracts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusClasses = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-l-4 border-amber-500";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500";
      default:
        return "bg-gray-50 text-gray-600 border-l-4 border-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600 text-lg animate-pulse">
          Loading contracts...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          icon={<FaFileContract size={26} />}
          label="Total Contracts"
          count={contracts.length}
          color="bg-slate-800"
        />
        <SummaryCard
          icon={<FaHourglassHalf size={26} />}
          label="Pending"
          count={contracts.filter((c) => c.status === "PENDING").length}
          color="bg-amber-600"
        />
        <SummaryCard
          icon={<FaCheckCircle size={26} />}
          label="Completed"
          count={contracts.filter((c) => c.status === "COMPLETED").length}
          color="bg-emerald-600"
        />
      </div>

      {/* Search & Filter */}
      <div className="bg-white shadow-sm rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 p-4 mb-8 border border-slate-200">
        <div className="relative w-full md:max-w-md">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-600 text-gray-700"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-600 text-gray-700"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Contracts List */}
      {displayedContracts.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg font-medium">
          No contracts match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedContracts.map((contract) => (
            <div
              key={contract.id}
              className={`rounded-xl shadow-md p-6 hover:shadow-lg transition border ${getStatusClasses(
                contract.status
              )}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <FaFileContract /> Contract #{contract.id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusClasses(
                    contract.status
                  )}`}
                >
                  {contract.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Proposal ID: <strong>{contract.proposalId}</strong>
              </p>
              <p className="text-slate-700 mt-2 text-sm">
                {contract.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, label, count, color }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center hover:scale-105 transform transition`}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
      <h3 className="text-xl font-bold">{count}</h3>
    </div>
  );
}
