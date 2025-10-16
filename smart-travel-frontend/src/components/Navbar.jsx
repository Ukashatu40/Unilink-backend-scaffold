import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Smart Travel Insights</h1>
        <div className="space-x-4">
          <a href="#" className="hover:text-gray-200">Dashboard</a>
          <a href="#" className="hover:text-gray-200">Reviews</a>
          <a href="#" className="hover:text-gray-200">Login</a>
        </div>
      </div>
    </nav>
  );
}
