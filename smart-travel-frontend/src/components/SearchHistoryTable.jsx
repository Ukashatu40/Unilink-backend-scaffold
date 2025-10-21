import { useEffect, useState } from "react";
import { getSearchHistory } from "../api/searchHistory";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { downloadExport, saveBlob } from "../api/export";

const SearchHistoryTable = ({ token }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExport = async (type) => {
    try {
      const blob = await downloadExport("search-history", type, token);
      saveBlob(blob, `search_history.${type}`);
    } catch (err) {
      console.error(err);
      alert("Export failed: " + err.message);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSearchHistory(token);
        setHistory(data);
      } catch (err) {
        console.error("Error fetching search history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading)
    return <p className="text-gray-500 text-sm">Loading search history...</p>;
  if (history.length === 0)
    return <p className="text-gray-500 text-sm">No recent searches yet.</p>;

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recent Searches</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="px-3 py-1 bg-red-500 rounded text-white font-semibold"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-3 py-1 bg-green-500 rounded text-white font-semibold"
          >
            Export PDF
          </button>
        </div>
      </div>
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-w-full text-left text-sm text-gray-700"
      >
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm">
            <th className="py-2 px-4 text-left">City</th>
            <th className="py-2 px-4 text-left">Weather</th>
            <th className="py-2 px-4 text-left">Traffic</th>
            <th className="py-2 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <AnimatePresence>
            {history.map((item) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{item.city}</td>
                <td className="px-4 py-2">
                  {item.weather ? item.weather.weather : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {item.traffic ? item.traffic.status : "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-500 text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </motion.table>
    </div>
  );
};

export default SearchHistoryTable;
