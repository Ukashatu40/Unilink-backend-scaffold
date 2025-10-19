// File: src/models/ReviewAnalysis.js
const mongoose = require("mongoose");

const reviewAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    text: { type: String, required: true },
    sentiment: { type: String, required: true },
    confidence: { type: Number, required: true },
    explanation: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReviewAnalysis", reviewAnalysisSchema);
