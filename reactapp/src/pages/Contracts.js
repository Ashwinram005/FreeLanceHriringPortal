import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaFileContract,
  FaSort,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("COMPLETED_FIRST");
  const [filterOption, setFilterOption] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const pageSize = 3;
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const userId = localStorage.getItem("userId");

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError("");

        let url =
          role === "CLIENT"
            ? `https://freelancehriringportal.onrender.com/contracts/client/${userId}`
            : `https://freelancehriringportal.onrender.com/contracts/freelancer/${userId}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(response.data);
      } catch (err) {
        console.error(err.response || err);
        setError("Failed to fetch contracts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [role, userId, token]);

  // Delete contract
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://freelancehriringportal.onrender.com/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contract deleted successfully!");
    } catch (err) {
      console.error(err.response || err);
      toast.error("Failed to delete contract. Try again.");
    } finally {
      setModalOpen(false);
      setSelectedContract(null);
    }
  };

  // Filter + Sort
  const filteredContracts = contracts.filter((c) =>
    filterOption === "ALL" ? true : c.status === filterOption
  );

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    const order =
      sortOption === "COMPLETED_FIRST"
        ? { COMPLETED: 0, PENDING: 1 }
        : { PENDING: 0, COMPLETED: 1 };
    return order[a.status] - order[b.status];
  });

  // Pagination
  const totalPages = Math.ceil(sortedContracts.length / pageSize);
  const displayedContracts = sortedContracts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Summary Data
  const totalContracts = contracts.length;
  const completedContracts = contracts.filter(
    (c) => c.status === "COMPLETED"
  ).length;
  const pendingContracts = contracts.filter(
    (c) => c.status === "PENDING"
  ).length;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-500 text-lg animate-pulse">
          Loading contracts...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            label="Total Contracts"
            value={totalContracts}
            color="from-blue-500 to-indigo-500"
            icon={<FaFileContract size={28} />}
          />
          <SummaryCard
            label="Pending"
            value={pendingContracts}
            color="from-yellow-400 to-orange-400"
            icon={<FaHourglassHalf size={28} />}
          />
          <SummaryCard
            label="Completed"
            value={completedContracts}
            color="from-green-400 to-emerald-500"
            icon={<FaCheckCircle size={28} />}
          />
        </div>

        {/* Filter & Sorting */}
        <div className="flex justify-center items-center mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-gray-700 font-medium">
              Filter:
            </label>
            <select
              id="filter"
              value={filterOption}
              onChange={(e) => {
                setFilterOption(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="ALL">All</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Contract List */}
        {displayedContracts.length === 0 ? (
          <p className="text-center text-gray-500">
            No contracts match the selected filter.
          </p>
        ) : (
          <div className="grid gap-6">
            {displayedContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-1">
                  <p className="text-gray-800 font-semibold">
                    Contract ID:{" "}
                    <span className="font-normal text-gray-600">
                      {contract.id}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Project ID:{" "}
                    <span className="font-normal text-gray-600">
                      {contract.proposalId}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Description:{" "}
                    <span className="font-normal text-gray-600">
                      {contract.description}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        contract.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedContract(contract);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1 mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && selectedContract && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">Delete Contract</h3>
            <p className="mb-6">
              Are you sure you want to delete project ID{" "}
              <strong>{selectedContract.proposalId}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(selectedContract.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedContract(null);
                }}
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

// Reusable Summary Card
function SummaryCard({ label, value, color, icon }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center`}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
