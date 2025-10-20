// File: src/routes/weather.js
const express = require('express');
const axios = require('axios');
const SearchHistory = require("../models/SearchHistory");
const auth = require('../middleware/auth');


const router = express.Router();


router.get('/:city', auth, async (req, res) => {
try {
const { city } = req.params;
const apiKey = process.env.OPENWEATHER_API_KEY;
if (!apiKey) return res.status(500).json({ message: 'OpenWeather API key not configured' });


const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
const response = await axios.get(url);
const d = response.data;


const out = {
city: d.name,
temp: d.main.temp,
weather: d.weather[0].description,
humidity: d.main.humidity,
wind_m_s: d.wind.speed
};

// Save to search history
await SearchHistory.create({userId: req.user.userId, city, weather: out });


res.json(out);
} catch (err) {
console.error(err?.response?.data || err.message);
res.status(500).json({ message: 'Failed to fetch weather' });
}
});


module.exports = router;