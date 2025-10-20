// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // registration OK — redirect to login page
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Register</h2>
        <input name="username" placeholder="Username" required onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
        {message && <p className="mt-3 text-red-600">{message}</p>}
      </form>
    </div>
  );
}
