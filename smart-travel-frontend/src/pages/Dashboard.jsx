import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import TrafficCard from "../components/TrafficCard";
import { API_BASE_URL } from "../config";
import SearchHistoryTable from "../components/SearchHistoryTable";
const token = localStorage.getItem("token");
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setTraffic(null);

    try {
      const token = localStorage.getItem("token");

      const [weatherRes, trafficRes] = await Promise.all([
        fetch(`${API_BASE_URL}/weather/${city}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/traffic/${city}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!weatherRes.ok || !trafficRes.ok)
        throw new Error("Failed to fetch data.");

      const weatherData = await weatherRes.json();
      const trafficData = await trafficRes.json();

      setWeather(weatherData);
      setTraffic(trafficData);
    } catch (err) {
      console.error(err);
      setError("Could not fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 px-4 md:px-8">
      {/* Page Header */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Smart Travel Insights
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        className="max-w-2xl mx-auto w-full mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>

      {/* Loading / Error States */}
      {loading && <p className="text-gray-500 text-center mt-4">Loading...</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl mx-auto">
        <motion.div
          className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">Weather</h3>
          <WeatherCard data={weather} />
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">Traffic</h3>
          <TrafficCard data={traffic} />
        </motion.div>
      </div>

      {/* Search History Section */}
      <motion.div
        className="mt-10 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Recent Searches
        </h2>
        <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
          <SearchHistoryTable token={token} />
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
