// src/components/Header.js
import React from "react";

export default function Header() {
  return (
    <header className="relative overflow-hidden text-center text-gray-900 px-6 py-20 rounded-b-[40px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
        ✨ FreelanceHub
      </h1>
      <p className="mt-4 text-xl font-medium text-white/90">
        Where Projects Meet Talent
      </p>
      <p className="mt-3 text-base text-white/80">
        Post, Browse, and Collaborate — all in one platform.
      </p>
    </header>
  );
}
