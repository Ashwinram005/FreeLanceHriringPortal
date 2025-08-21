// src/components/Navbar.js
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderPlus,
  Briefcase,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold tracking-wide transition-all duration-300
     ${
       location.pathname === path
         ? "bg-white/20 text-white shadow-md backdrop-blur-sm"
         : "text-white/80 hover:text-white hover:bg-white/10"
     }`;

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 
                 bg-gradient-to-b from-indigo-700 via-blue-700 to-cyan-600
                 text-white shadow-xl flex flex-col z-50 border-r border-white/10"
    >
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-white/20">
        <h1 className="text-2xl font-bold tracking-wide drop-shadow-md">
          Freelance<span className="text-yellow-300 font-extrabold">Hub</span>
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          {role === "ADMIN" && (
            <>
              <li>
                <Link to="/manage-users" className={linkClass("/manage-users")}>
                  <Users size={20} /> Manage Users
                </Link>
              </li>
              <li>
                <Link
                  to="/view-contracts"
                  className={linkClass("/view-contracts")}
                >
                  <FileText size={20} /> Contracts
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/post-project" className={linkClass("/post-project")}>
                  <FolderPlus size={20} /> Post Project
                </Link>
              </li>
            </>
          )}

          {role === "CLIENT" && (
            <>
              <li>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/post-project" className={linkClass("/post-project")}>
                  <FolderPlus size={20} /> Post Project
                </Link>
              </li>
              <li>
                <Link to="/contracts" className={linkClass("/contracts")}>
                  <FileText size={20} /> Contracts
                </Link>
              </li>
            </>
          )}

          {role === "FREELANCER" && (
            <>
              <li>
                <Link
                  to="/freelancer-dashboard"
                  className={linkClass("/freelancer-dashboard")}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-projects"
                  className={linkClass("/browse-projects")}
                >
                  <Briefcase size={20} /> Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/contracts" className={linkClass("/contracts")}>
                  <FileText size={20} /> Contracts
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/profile" className={linkClass("/profile")}>
              <User size={20} /> Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-6 py-5 border-t border-white/20">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 
                     bg-gradient-to-r from-pink-500 to-red-500 
                     text-white font-bold py-2.5 px-4 rounded-lg 
                     hover:from-pink-600 hover:to-red-600 
                     shadow-md hover:shadow-lg transition-all duration-300"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
