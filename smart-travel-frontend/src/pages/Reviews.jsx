import { useState } from "react";
import { API_BASE_URL } from "../config";

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
      const res = await fetch(`${API_BASE_URL}/reviews/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to analyze sentiment");
      const data = await res.json();
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
        <div className="mt-6 bg-white p-5 rounded-lg shadow-md text-center max-w-md w-full">
          <p className="text-lg">
            Sentiment:{" "}
            <span
              className={
                result.sentiment === "Positive"
                  ? "text-green-600 font-semibold"
                  : result.sentiment === "Negative"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {result.sentiment}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default Reviews;
