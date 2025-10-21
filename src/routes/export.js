// src/routes/export.js
const express = require('express');
const auth = require('../middleware/auth');
const ReviewAnalysis = require('../models/ReviewAnalysis');
const SearchHistory = require('../models/SearchHistory');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');

const router = express.Router();

// helper to send CSV
function sendCSV(res, filename, data, fields) {
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
}

// helper to send PDF (simple table-like)
function sendPDF(res, filename, rows, columns) {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  doc.fontSize(16).text(filename.replace(/_/g, ' '), { align: 'center' });
  doc.moveDown();

  // table header
  doc.fontSize(10);
  const colWidths = columns.map(() => Math.floor((doc.page.width - 60) / columns.length));

  rows.forEach((row, idx) => {
    // limit rows per page
    if (doc.y > doc.page.height - 80) doc.addPage();

    columns.forEach((col, i) => {
      const text = (row[col] === undefined || row[col] === null) ? '-' : String(row[col]);
      // limit text length to avoid overflow
      const slice = text.length > 80 ? text.slice(0, 77) + '...' : text;
      doc.text(slice, { continued: i !== columns.length - 1, width: colWidths[i] });
    });
    doc.moveDown(0.4);
  });

  doc.end();
}

// GET /export/search-history?format=csv|pdf
router.get('/search-history', auth, async (req, res) => {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const userId = req.user.userId;

    const docs = await SearchHistory.find({ userId }).sort({ createdAt: -1 }).lean().limit(200);

    // normalize rows
    const rows = docs.map(d => ({
      city: d.city || '',
      weather: d.weather ? (d.weather.weather || JSON.stringify(d.weather)) : '',
      traffic: d.traffic ? (d.traffic.status || JSON.stringify(d.traffic)) : '',
      createdAt: dayjs(d.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }));

    const filenameBase = `search_history_${userId}_${dayjs().format('YYYYMMDD_HHmm')}`;
    if (format === 'pdf') {
      return sendPDF(res, `${filenameBase}.pdf`, rows, ['city', 'weather', 'traffic', 'createdAt']);
    } else {
      // CSV
      return sendCSV(res, `${filenameBase}.csv`, rows, ['city', 'weather', 'traffic', 'createdAt']);
    }
  } catch (err) {
    console.error('Export search-history error:', err);
    res.status(500).json({ message: 'Export failed' });
  }
});

// GET /export/sentiment-history?format=csv|pdf
router.get('/sentiment-history', auth, async (req, res) => {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const userId = req.user.userId;

    const docs = await ReviewAnalysis.find({ userId }).sort({ createdAt: -1 }).lean().limit(500);

    const rows = docs.map(d => ({
      text: d.text,
      sentiment: d.sentiment,
      confidence: d.confidence,
      explanation: (d.explanation || []).join(', '),
      createdAt: dayjs(d.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }));

    const filenameBase = `sentiment_history_${userId}_${dayjs().format('YYYYMMDD_HHmm')}`;

    if (format === 'pdf') {
      return sendPDF(res, `${filenameBase}.pdf`, rows, ['text', 'sentiment', 'confidence', 'explanation', 'createdAt']);
    } else {
      return sendCSV(res, `${filenameBase}.csv`, rows, ['text', 'sentiment', 'confidence', 'explanation', 'createdAt']);
    }
  } catch (err) {
    console.error('Export sentiment-history error:', err);
    res.status(500).json({ message: 'Export failed' });
  }
});

module.exports = router;
