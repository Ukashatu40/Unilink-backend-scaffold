// File: src/routes/reviews.js
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const ReviewAnalysis = require("../models/ReviewAnalysis");


const router = express.Router();


// POST /reviews/sentiment
// body: { text: string }
router.post('/sentiment', auth, async (req, res) => {
    // router.post("/sentiment", async (req, res) => {
        try {
          const { text } = req.body;
          if (!text) return res.status(400).json({ message: "text is required" });
      
          const fastApiUrl = process.env.FASTAPI_URL;
      
          let result;
          if (!fastApiUrl) {
            result = {
              label: "neutral",
              confidence: 0.65,
              explanation: ["late", "clean"],
              note: "mocked - set FASTAPI_URL to enable real predictions",
            };
          } else {
            const resp = await axios.post(fastApiUrl, { text }, { timeout: 5000 });
            result = resp.data;
          }
      
          // Save to DB
          const saved = await ReviewAnalysis.create({
            userId: req.user.userId,
            text,
            sentiment: result.label,
            confidence: result.confidence,
            explanation: result.explanation || [],
          });
      
          res.json({ ...result, id: saved._id });
        } catch (err) {
          console.error(err?.response?.data || err.message);
          res.status(500).json({ message: "Failed to get sentiment" });
        }
      });

// GET /reviews/history
router.get("/history", auth, async (req, res) => {
    try {

      // You can later filter by userId if auth is added
      const history = await ReviewAnalysis.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(50);

      res.json(history);
    } catch (err) {
      console.error("Failed to fetch history:", err.message);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

// GET /reviews/history
// router.get('/history', auth, async (req, res) => {
//     try {
//       const reviews = await ReviewAnalysis.find({ userId: req.user.userId }).sort({
//         createdAt: -1,
//       });
//       res.json(reviews);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ message: 'Failed to fetch review history' });
//     }
//   });
  


module.exports = router;