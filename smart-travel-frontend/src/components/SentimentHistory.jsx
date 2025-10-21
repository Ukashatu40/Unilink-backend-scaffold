import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { downloadExport, saveBlob } from "../api/export";

export default function SentimentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleExport = async (type) => {
    try {
      const blob = await downloadExport("sentiment-history", type, token);
      saveBlob(blob, `sentiment_history.${type}`);
    } catch (err) {
      console.error(err);
      alert("Export failed: " + err.message);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/reviews/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching sentiment history:", err);
        setError("Failed to load sentiment history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-8 p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold mb-4">Sentiment History</h2>
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

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-3 border-b">#</th>
            <th className="py-2 px-3 border-b">Text</th>
            <th className="py-2 px-3 border-b">Sentiment</th>
            <th className="py-2 px-3 border-b">Confidence</th>
            <th className="py-2 px-3 border-b">Keywords</th>
            <th className="py-2 px-3 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, i) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="py-2 px-3 border-b">{i + 1}</td>
              <td className="py-2 px-3 border-b">{item.text}</td>
              <td
                className={`py-2 px-3 border-b font-medium ${
                  item.sentiment === "positive"
                    ? "text-green-600"
                    : item.sentiment === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {item.sentiment}
              </td>
              <td className="py-2 px-3 border-b">
                {(item.confidence * 100).toFixed(0)}%
              </td>
              <td className="py-2 px-3 border-b">
                {item.explanation.join(", ") || "-"}
              </td>
              <td className="py-2 px-3 border-b">
                {new Date(item.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
