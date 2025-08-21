import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VisitProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/auth/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">User not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-0.5"
      >
        ⬅ Back
      </button>

      {/* Profile Card */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Professional Design */}
        <div className="md:w-1/3 p-8 flex flex-col items-center bg-gradient-to-b from-blue-500 to-blue-700 text-white relative">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg bg-blue-400 flex items-center justify-center text-5xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-4 right-0 flex gap-2">
              <span className="bg-white text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {user.role}
              </span>
            </div>
          </div>

          <h2 className="mt-6 text-2xl font-semibold">{user.name}</h2>
          <p className="mt-2 text-blue-100 text-center">
            {/* Optional description or tagline */}
            {user.bio || "Professional Profile"}
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:w-2/3 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {["About", "Contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium -mb-px transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-b-4 border-blue-600 text-blue-700"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4 text-gray-700">
            {activeTab === "About" && (
              <>
                <p>
                  <span className="font-semibold text-gray-800">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Role:</span> {user.role}
                </p>
                {user.bio && (
                  <p>
                    <span className="font-semibold text-gray-800">Bio:</span> {user.bio}
                  </p>
                )}
              </>
            )}
            {activeTab === "Contact" && (
              <>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span> {user.email}
                </p>
                {user.phone && (
                  <p>
                    <span className="font-semibold text-gray-800">Phone:</span> {user.phone}
                  </p>
                )}
                {user.website && (
                  <p>
                    <span className="font-semibold text-gray-800">Website:</span>{" "}
                    <a href={user.website} target="_blank" className="text-blue-600 hover:underline">
                      {user.website}
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
