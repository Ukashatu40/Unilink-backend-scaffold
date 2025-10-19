// File: src/models/SearchHistory.js
const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    city: { type: String, required: true },
    weather: { type: Object },
    traffic: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
