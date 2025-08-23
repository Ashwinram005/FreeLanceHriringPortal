// src/components/Milestones.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Milestones() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [contractId, setContractId] = useState(null);
  const [contractStatus, setContractStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMilestones();
  }, [projectId, token]);

  const fetchMilestones = () => {
        console.log();

    axios
      .get(`https://freelancehriringportal.onrender.com/milestones/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMilestones(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`https://freelancehriringportal.onrender.com/contracts/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setContractId(res.data.id);
          setContractStatus(res.data.status);
        }
      })
      .catch((err) => console.error(err));
  }, [projectId, token]);

  const handleContractStatusChange = (newStatus) => {
    setContractStatus(newStatus);
    if (!contractId) return;
    axios
      .put(
        `https://freelancehriringportal.onrender.com/contracts/${contractId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => toast.success("Contract status updated"))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update contract status");
      });
  };

  const handleMilestoneStatusChange = (milestoneId, newStatus) => {
    axios
      .put(
        `https://freelancehriringportal.onrender.com/milestones/${milestoneId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === milestoneId ? { ...m, status: newStatus } : m
          )
        );
        toast.success("Milestone status updated");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update milestone status");
      });
  };

  const handleAddMilestone = (e) => {
    console.log("ContractId,contractId");
    e.preventDefault();
    if (!contractId) {
      toast.error("No contract found for this project. Cannot add milestone.");
      return;
    }
    axios
      .post(
        "https://freelancehriringportal.onrender.com/milestones",
        { contractId, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMilestones([...milestones, res.data]);
        setDescription("");
        setStatus("PENDING");
        setShowForm(false);
        toast.success("Milestone added successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add milestone");
      });
  };

  const handleDeleteMilestone = (id) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) return;
    axios
      .delete(`https://freelancehriringportal.onrender.com/milestones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
        toast.success("Milestone deleted");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete milestone");
      });
  };

  const handleDeleteFile = (milestoneId) => {
    axios
      .delete(`https://freelancehriringportal.onrender.com/milestones/${milestoneId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) => (m.id === milestoneId ? { ...m, fileName: null } : m))
        );
        toast.success("File deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete file");
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-slate-800 mb-8">
        Milestones for Project <span className="text-blue-600">#{projectId}</span>
      </h2>

      {contractStatus && (
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium text-slate-700">Contract Status:</label>
          <select
            value={contractStatus}
            onChange={(e) => handleContractStatusChange(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition"
      >
        {showForm ? "Cancel" : "➕ Add Milestone"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAddMilestone}
          className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-4 border"
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Milestone description..."
            className="w-full min-h-[80px] p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none resize-y"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 ml-10 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Save Milestone
          </button>
        </form>
      )}

      {milestones.length === 0 ? (
        <p className="text-slate-500">No milestones yet.</p>
      ) : (
        <div className="grid gap-6">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-slate-800 mb-3">
                {m.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <label className="font-medium text-slate-700">Status:</label>
                <select
                  value={m.status}
                  onChange={(e) =>
                    handleMilestoneStatusChange(m.id, e.target.value)
                  }
                  className="px-3 py-1 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(`/projects/${projectId}/milestones/${m.id}/upload`)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Upload File
                </button>

                {m.fileName && (
                  <button
                    onClick={() => handleDeleteFile(m.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                  >
                    Delete File
                  </button>
                )}

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg shadow hover:bg-rose-600 transition"
                >
                  Delete Milestone
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
