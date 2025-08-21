// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resUsers = await axios.get(
          "http://localhost:8080/api/auth/users"
        );
        const currentUser = resUsers.data.find((u) => u.id === userId);
        setUser(currentUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg bg-blue-400 flex items-center justify-center text-5xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>{" "}
          <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-blue-50 p-5 rounded-2xl shadow-inner hover:shadow-md transition-shadow duration-300">
            <FaEnvelope className="text-blue-500 text-2xl" />
            <span className="text-gray-800 font-medium break-all">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-4 bg-green-50 p-5 rounded-2xl shadow-inner hover:shadow-md transition-shadow duration-300">
            <FaIdBadge className="text-green-500 text-2xl" />
            <span className="text-gray-800 font-semibold">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
