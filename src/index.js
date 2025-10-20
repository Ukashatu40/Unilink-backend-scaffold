// File: src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


// Routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const trafficRoutes = require('./routes/traffic');
const reviewsRoutes = require('./routes/reviews');
const searchHistoryRoutes = require("./routes/searchHistory");


app.use('/auth', authRoutes);
app.use('/weather', weatherRoutes);
app.use('/traffic', trafficRoutes);
app.use('/reviews', reviewsRoutes);
app.use("/search-history", searchHistoryRoutes)

app.get('/', (req, res) => res.json({ status: 'ok', service: 'Smart Travel Backend' }));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));