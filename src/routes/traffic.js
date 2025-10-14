// File: src/routes/traffic.js
const express = require('express');


const router = express.Router();


// Simple mocked traffic data - replace with real provider integration later
const mockTraffic = {
lagos: { city: 'Lagos', status: 'heavy', expected_delay_min: 25, notes: 'Ikeja - Apapa corridor congested' },
abuja: { city: 'Abuja', status: 'moderate', expected_delay_min: 12, notes: 'Central business district slow' }
};


router.get('/:city', (req, res) => {
const cityKey = req.params.city.toLowerCase();
const data = mockTraffic[cityKey] || { city: req.params.city, status: 'unknown', expected_delay_min: 0, notes: 'No data (mock)' };
res.json(data);
});


module.exports = router;