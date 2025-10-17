// File: src/routes/reviews.js
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');


const router = express.Router();


// POST /reviews/sentiment
// body: { text: string }
// router.post('/sentiment', auth, async (req, res) => {
router.post('/sentiment', async (req, res) => {
try {
const { text } = req.body;
if (!text) return res.status(400).json({ message: 'text is required' });


const fastApiUrl = process.env.FASTAPI_URL; // e.g. http://localhost:8000/predict
if (!fastApiUrl) {
// Return a simple mocked response if no model is configured
const mock = {
label: 'neutral',
confidence: 0.65,
explanation: ['late', 'clean']
};
return res.json({ ...mock, note: 'mocked - set FASTAPI_URL to enable real predictions' });
}


const resp = await axios.post(fastApiUrl, { text }, { timeout: 5000 });
// Expecting { label, confidence, scores?, explanation? }
const result = resp.data;


// TODO: store review_analysis record in DB when schema exists


res.json(result);
} catch (err) {
console.error(err?.response?.data || err.message);
res.status(500).json({ message: 'Failed to get sentiment' });
}
});


module.exports = router;