import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import TrafficCard from "../components/TrafficCard";
import { API_BASE_URL } from "../config";

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
      const [weatherRes, trafficRes] = await Promise.all([
        fetch(`${API_BASE_URL}/weather/${city}`),
        fetch(`${API_BASE_URL}/traffic/${city}`),
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
    <div className="min-h-screen flex flex-col items-center pt-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Smart Travel Insights</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <p className="mt-6 text-gray-500">Loading...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      <WeatherCard data={weather} />
      <TrafficCard data={traffic} />
    </div>
  );
}

export default Dashboard;
