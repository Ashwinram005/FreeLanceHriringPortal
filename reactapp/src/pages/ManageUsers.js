// src/pages/ManageUsers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTrash,
  FaUserAlt,
  FaEye,
  FaUsers,
  FaSearch,
  FaUsersCog,
} from "react-icons/fa";

export default function ManageUsers() {
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Admins");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://freelancehriringportal.onrender.com/api/auth/users");
      const allUsers = res.data;
      setClients(allUsers.filter((u) => u.role.toUpperCase() === "CLIENT"));
      setFreelancers(
        allUsers.filter((u) => u.role.toUpperCase() === "FREELANCER")
      );
      setAdmins(allUsers.filter((u) => u.role.toUpperCase() === "ADMIN"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://freelancehriringportal.onrender.com/api/auth/users/${deleteUserId}`
      );
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user.");
    } finally {
      setIsModalOpen(false);
      setDeleteUserId(null);
    }
  };

  const getActiveUsers = () => {
    let users =
      activeTab === "Admins"
        ? admins
        : activeTab === "Clients"
        ? clients
        : freelancers;
    if (searchTerm) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return users;
  };

  const paginatedUsers = () => {
    const users = getActiveUsers();
    const totalPages = Math.ceil(users.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return { data: users.slice(start, end), totalPages };
  };

  const roleColor = (role) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-600 text-white";
      case "CLIENT":
        return "bg-green-500 text-white";
      case "FREELANCER":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const { data: displayedUsers, totalPages } = paginatedUsers();

  const totalUsers = admins.length + clients.length + freelancers.length;

  const renderUserCard = (user) => (
    <div
      key={user.id}
      className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transform hover:-translate-y-1 transition relative border-l-4 border-blue-400`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaUserAlt className="text-blue-500 text-xl" />
          <div>
            <p className="text-gray-900 font-semibold text-lg">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${roleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          <FaEye /> View
        </button>
        <button
          onClick={() => confirmDeleteUser(user.id)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );

  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg mt-20 animate-pulse">
        Loading users...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 p-8 font-sans max-w-7xl mx-auto">
      <Toaster position="top-right" />
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<FaUsersCog size={28} />}
          label="Total Users"
          count={totalUsers}
          color="from-blue-500 to-indigo-600"
        />
        <SummaryCard
          icon={<FaUsers size={28} />}
          label="Admins"
          count={admins.length}
          color="from-purple-500 to-indigo-600"
        />
        <SummaryCard
          icon={<FaUsers size={28} />}
          label="Clients"
          count={clients.length}
          color="from-green-400 to-teal-500"
        />
        <SummaryCard
          icon={<FaUsers size={28} />}
          label="Freelancers"
          count={freelancers.length}
          color="from-orange-400 to-yellow-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-6 border-b-2 border-gray-200">
        {["Admins", "Clients", "Freelancers"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`pb-2 text-lg font-semibold transition ${
              activeTab === tab
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-lg">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium"
          />
        </div>
      </div>

      {/* User Grid */}
      {displayedUsers.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg font-medium">
          No users found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUsers.map(renderUserCard)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-xl border border-blue-500 text-blue-500 font-medium disabled:opacity-50 hover:bg-blue-50 transition"
          >
            Previous
          </button>
          <span className="font-medium text-gray-700 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2 rounded-xl border border-blue-500 text-blue-500 font-medium disabled:opacity-50 hover:bg-blue-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary Card
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
