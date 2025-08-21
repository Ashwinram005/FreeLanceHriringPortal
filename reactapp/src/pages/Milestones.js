import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    axios
      .get(`http://localhost:8080/milestones/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMilestones(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/contracts/project/${projectId}`, {
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
        `http://localhost:8080/contracts/${contractId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err) => console.error(err));
  };

  const handleMilestoneStatusChange = (milestoneId, newStatus) => {
    axios
      .put(
        `http://localhost:8080/milestones/${milestoneId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === milestoneId ? { ...m, status: newStatus } : m
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!contractId) {
      alert("No contract found for this project. Cannot add milestone.");
      return;
    }
    axios
      .post(
        "http://localhost:8080/milestones",
        { contractId, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMilestones([...milestones, res.data]);
        setDescription("");
        setStatus("PENDING");
        setShowForm(false);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteMilestone = (id) => {
    if (!window.confirm("Are you sure you want to delete this milestone?"))
      return;
    axios
      .delete(`http://localhost:8080/milestones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteFile = (milestoneId) => {
    axios
      .delete(`http://localhost:8080/milestones/${milestoneId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMilestones((prev) =>
          prev.map((m) => (m.id === milestoneId ? { ...m, fileName: null } : m))
        );
      })
      .catch((err) => console.error(err));
  };

  const completedCount = milestones.filter(m => m.status === "COMPLETED").length;
  const completionPercent = milestones.length ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">📌 Project Milestones</h2>
          <p className="text-slate-600">Track progress and manage all project milestones efficiently.</p>

          {milestones.length > 0 && (
            <div className="mt-4 bg-slate-200 rounded-full h-4 w-full overflow-hidden shadow-inner">
              <div
                className="h-4 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Contract Status */}
        {contractStatus && (
          <div className="mb-6 bg-white shadow-md p-4 rounded-xl flex items-center gap-4">
            <label className="font-semibold text-slate-700">Contract Status:</label>
            <select
              value={contractStatus}
              onChange={(e) => handleContractStatusChange(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        )}

        {/* Add Milestone Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={`mb-6 px-6 py-2 font-medium rounded-lg shadow-md transition 
            ${showForm ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {showForm ? "Cancel" : "➕ Add Milestone"}
        </button>

        {/* Add Milestone Form */}
        {showForm && (
          <form
            onSubmit={handleAddMilestone}
            className="mb-8 bg-white shadow-xl rounded-2xl p-6 space-y-4"
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter milestone description..."
              className="w-full min-h-[100px] px-4 py-3 border rounded-xl shadow-sm focus:ring focus:ring-blue-300 resize-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border rounded-xl shadow-sm focus:ring focus:ring-blue-300"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition"
            >
              ✅ Save Milestone
            </button>
          </form>
        )}

        {/* Milestones List */}
        {milestones.length === 0 ? (
          <p className="text-slate-500 text-center">No milestones yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition duration-300"
              >
                <p className="text-lg font-semibold text-slate-800 mb-2">{m.description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-600">Status:</label>
                  <select
                    value={m.status}
                    onChange={(e) => handleMilestoneStatusChange(m.id, e.target.value)}
                    className="px-3 py-1 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/projects/${projectId}/milestones/${m.id}/upload`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
                  >
                    ⬆️ Upload File
                  </button>

                  {m.fileName && (
                    <button
                      onClick={() => handleDeleteFile(m.id)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition"
                    >
                      🗑️ Delete File
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
                  >
                    ❌ Delete Milestone
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
