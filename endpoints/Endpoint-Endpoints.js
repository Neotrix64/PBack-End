const express = require('express');
const router = express.Router();
const Endpoint = require('../models/Endpoint');

// POST /api/endpoints - Create endpoint
router.post('/Register', async (req, res) => {
  try {
    const { folderId, method, url, headers, body, authType } = req.body;

    const newEndpoint = new Endpoint({
      folderId,
      method,
      url,
      headers,
      body,
      authType
    });

    const saved = await newEndpoint.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating endpoint', details: err.message });
  }
});

// GET /api/endpoints/folder/:folderId - Get endpoints by folder
router.get('/folder/:folderId', async (req, res) => {
  try {
    const endpoints = await Endpoint.find({ folderId: req.params.folderId }).sort({ createdAt: -1 });
    res.json(endpoints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching endpoints by folder', details: err.message });
  }
});

// GET /api/endpoints/:id - Get single endpoint
router.get('/:id', async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);
    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json(endpoint);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching endpoint', details: err.message });
  }
});

// PUT /api/endpoints/:id - Update endpoint
router.put('/:id', async (req, res) => {
  try {
    const updated = await Endpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating endpoint', details: err.message });
  }
});

// DELETE /api/endpoints/:id - Delete endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Endpoint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json({ message: 'Endpoint deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting endpoint', details: err.message });
  }
});

module.exports = router;
