import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Smart Travel Insights</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-200">Dashboard</Link>
          <Link to="/reviews" className="hover:text-gray-200">Reviews</Link>
        </div>
      </div>
    </nav>
  );
}
