// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { validateEmail, validatePassword } from "../utils";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email) || !validatePassword(password)) {
      toast.error(
        "Please enter a valid email and password (min 6 characters)."
      );
      return;
    }

    try {
      setLoading(true);
      await registerUser({ name, email, password, role });
      toast.success("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Server not reachable. Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />

      {/* Left Branding Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-md text-center animate-fadeIn">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-xl">
            FreelanceHub
          </h1>
          <p className="text-lg font-medium mb-3">
            🌟 Start Your Journey Today
          </p>
          <p className="text-white/90 leading-relaxed">
            Create your account and explore opportunities as a client or
            freelancer.
          </p>
          <img
            src="https://illustrations.popsy.co/gray/remote-work.svg"
            alt="Register illustration"
            className="mt-10 w-72 mx-auto drop-shadow-lg hover:scale-105 transition"
          />
        </div>
      </div>

      {/* Right Register Section */}
      <div className="flex items-center justify-center px-6 lg:px-12">
        <form
          onSubmit={handleRegister}
          className="bg-white/90 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md backdrop-blur-md border border-gray-200 animate-slideUp"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6">Sign up to get started 🚀</p>

          <div className="mb-4">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="mb-5">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
            >
              <option value="CLIENT">Client</option>
              <option value="FREELANCER">Freelancer</option>
              {/* <option value="ADMIN">Admin</option> */}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02]"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
