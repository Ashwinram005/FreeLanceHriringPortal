// src/pages/PostProject.js
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaLightbulb, FaMoneyBillWave, FaCalendarAlt, FaTools } from "react-icons/fa";

export default function PostProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    minBudget: "",
    maxBudget: "",
    deadline: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
  const { title, description, minBudget, maxBudget, deadline, skills } = formData;

  if (!title || !description || !minBudget || !maxBudget || !deadline || !skills) {
    toast.error("All fields are required!");
    return false;
  }

  if (title.trim().length < 5) {
    toast.error("Title must be at least 5 characters!");
    return false;
  }

  if (Number(minBudget) < 10 || Number(maxBudget) < 10) {
    toast.error("Minimum budget for min/max should be at least 10!");
    return false;
  }

  if (Number(minBudget) > Number(maxBudget)) {
    toast.error("Min Budget cannot be greater than Max Budget!");
    return false;
  }

  const selectedDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate <= today) {
    toast.error("Deadline must be a future date!");
    return false;
  }

  if (skills.split(",").filter((s) => s.trim() !== "").length === 0) {
    toast.error("Please provide at least one skill!");
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const clientId = Number(localStorage.getItem("userId"));

    if (!token) return toast.error("You are not logged in!");
    if (!clientId) return toast.error("User ID not found!");

    const projectData = {
      ...formData,
      clientId,
      minBudget: Number(formData.minBudget),
      maxBudget: Number(formData.maxBudget),
      skills: formData.skills.split(",").map((s) => s.trim()),
      deadline: new Date(formData.deadline).toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Your idea has been posted successfully!");
      setFormData({
        title: "",
        description: "",
        minBudget: "",
        maxBudget: "",
        deadline: "",
        skills: "",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error posting your idea. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FaLightbulb className="text-yellow-500 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-900">Post Your Project Idea</h2>
        </div>
        <p className="text-gray-600 mb-8">
          Describe your project idea clearly and attract the best freelancers!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project idea..."
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition min-h-[140px] resize-y"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaMoneyBillWave className="absolute top-3 left-3 text-green-500" />
              <input
                type="number"
                name="minBudget"
                value={formData.minBudget}
                onChange={handleChange}
                placeholder="Min Budget"
                required
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              />
            </div>
            <div className="flex-1 relative">
              <FaMoneyBillWave className="absolute top-3 left-3 text-green-500" />
              <input
                type="number"
                name="maxBudget"
                value={formData.maxBudget}
                onChange={handleChange}
                placeholder="Max Budget"
                required
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="relative">
            <FaCalendarAlt className="absolute top-3 left-3 text-blue-500" />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <FaTools className="absolute top-3 left-3 text-purple-500" />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills required (comma separated)"
              required
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all"
          >
            Post Your Idea
          </button>
        </form>
      </div>
    </div>
  );
}
