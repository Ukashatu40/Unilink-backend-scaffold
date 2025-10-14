// File: src/middleware/auth.js
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'No token provided' });


const token = authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Malformed token' });


try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { userId, iat, exp }
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};