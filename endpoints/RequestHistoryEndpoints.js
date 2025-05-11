const express = require('express');
const router = express.Router();
const RequestHistory = require('../models/RequestHistory');

// POST /api/history - Log request
router.post('/Register', async (req, res) => {
  try {
    const { endpointId, environmentId, statusCode, response } = req.body;
    const newHistory = new RequestHistory({
      endpointId,
      environmentId,
      statusCode,
      response
    });
    const saved = await newHistory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error saving request history', details: err.message });
  }
});

// GET /api/history/endpoint/:endpointId - Get history by endpoint
router.get('/endpoint/:endpointId', async (req, res) => {
  try {
    const history = await RequestHistory.find({ endpointId: req.params.endpointId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history by endpoint', details: err.message });
  }
});

// GET /api/history/environment/:environmentId - Get history by environment
router.get('/environment/:environmentId', async (req, res) => {
  try {
    const history = await RequestHistory.find({ environmentId: req.params.environmentId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history by environment', details: err.message });
  }
});

// DELETE /api/history/:id - Delete specific history
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RequestHistory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'History not found' });
    }
    res.json({ message: 'History deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting history', details: err.message });
  }
});

module.exports = router;
