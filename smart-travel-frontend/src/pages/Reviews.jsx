import { useState } from "react";
import { API_BASE_URL } from "../config";
import SentimentHistory from "../components/SentimentHistory";

function Reviews() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {

    //   const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/reviews/sentiment`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to analyze sentiment");
      const data = await res.json();
      console.log("Sentiment result:", data);
      setResult(data);
    } catch (err) {
        console.log(err);
      setError("Error analyzing sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Review Sentiment Analysis</h1>

      <form
        onSubmit={handleAnalyze}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <textarea
          rows="4"
          placeholder="Paste your review here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </form>

      {loading && <p className="mt-6 text-gray-500">Analyzing...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {result && (
  <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
    <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
    <p className="text-gray-700">
      <strong>Sentiment:</strong>{" "}
      <span
        className={
          result.label === "positive"
            ? "text-green-600"
            : result.label === "negative"
            ? "text-red-600"
            : "text-gray-600"
        }
      >
        {result.label}
      </span>
    </p>
    <p className="text-gray-700 mt-1">
      <strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%
    </p>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
  <div
    className={`h-2 rounded-full ${
      result.label === "positive"
        ? "bg-green-500"
        : result.label === "negative"
        ? "bg-red-500"
        : "bg-gray-500"
    }`}
    style={{ width: `${result.confidence * 100}%` }}
  ></div>
</div>

    {result.explanation && (
      <p className="text-sm text-gray-500 mt-2">
        Key words: {result.explanation.join(", ")}
      </p>
    )}
    {result.note && (
      <p className="text-xs text-gray-400 italic mt-2">{result.note}</p>
    )}
  </div>
)}
      <SentimentHistory />

    </div>
  );
}

export default Reviews;
