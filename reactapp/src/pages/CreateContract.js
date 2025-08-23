// src/pages/CreateContract.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

export default function CreateContract() {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const proposalId = searchParams.get("proposalId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return toast.error("Please enter a description.");
    setSubmitting(true);
    try {
      await axios.post(
        "https://freelancehriringportal.onrender.com/contracts",
        { proposalId, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contract created successfully!");
      setTimeout(() => navigate("/freelancer-dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create contract.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <FaCheckCircle className="text-5xl text-green-500 mb-2" />
          <h2 className="text-3xl font-extrabold text-gray-800">
            Create Contract
          </h2>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none"
              placeholder="Enter contract description here..."
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`p-4 rounded-xl font-bold text-white transition-colors ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Contract"}
          </button>
        </form>
      </div>
    </div>
  );
}
