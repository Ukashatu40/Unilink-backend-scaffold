const express = require("express");
const router = express.Router();
const SearchHistory = require("../models/SearchHistory");
const auth = require("../middleware/auth"); // ✅ your existing middleware

// ✅ Save a new search (weather or traffic)
router.post("/", auth, async (req, res) => {
  try {
    const { city, weather, traffic } = req.body;

    const search = new SearchHistory({
      userId: req.user.userId,
      city,
      weather,
      traffic,
    });

    await search.save();
    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({ message: "Error saving search", error: error.message });
  }
});

// ✅ Fetch user’s recent searches
router.get("/", auth, async (req, res) => {
  try {
    const history = await SearchHistory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search history", error: error.message });
  }
});

module.exports = router;
