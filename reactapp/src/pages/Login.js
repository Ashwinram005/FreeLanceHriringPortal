// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { validateEmail, validatePassword } from "../utils";

export default function Login({ setToken, setRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email) || !validatePassword(password)) {
      setError("Please enter a valid email and password (min 6 characters).");
      return;
    }

    setLoading(true);
    try {
      const userData = await loginUser({ email, password });

      if (userData.token) {
        localStorage.setItem("token", userData.token);
        setToken(userData.token);
      }
      if (userData.role) {
        localStorage.setItem("role", userData.role.toUpperCase());
        setRole(userData.role.toUpperCase());
      }
      if (userData.id) localStorage.setItem("userId", userData.id);

      const roleUpper = (userData.role || "").toUpperCase();
      if (roleUpper === "ADMIN") navigate("/manage-users", { replace: true });
      else if (roleUpper === "CLIENT")
        navigate("/dashboard", { replace: true });
      else if (roleUpper === "FREELANCER")
        navigate("/freelancer-dashboard", { replace: true });
      else navigate("/login", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Branding Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-md text-center animate-fadeIn">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-xl">
            FreelanceHub
          </h1>
          <p className="text-lg font-medium mb-3">
            🚀 Where Projects Meet Talent
          </p>
          <p className="text-white/90 leading-relaxed">
            Post, browse, and collaborate with the best freelancers and clients
            on one platform.
          </p>
          {/* Illustration */}
          <img
            src="https://illustrations.popsy.co/gray/freelancer.svg"
            alt="Freelance illustration"
            className="mt-10 w-72 mx-auto drop-shadow-lg hover:scale-105 transition"
          />
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex items-center justify-center px-6 lg:px-12">
        <form
          onSubmit={handleLogin}
          className="bg-white/90 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md backdrop-blur-md border border-gray-200 animate-slideUp"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-6">
            Sign in to continue your journey on FreelanceHub
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-md border border-red-200">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="mb-5">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-sm text-gray-600 text-center">
            No account?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
