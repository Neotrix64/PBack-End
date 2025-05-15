const express = require('express');
const router = express.Router();
const Endpoint = require('../models/Endpoint');

// POST /api/endpoints - Create endpoint
// ✅ POST /api/endpoints/Register - Create endpoint
router.post('/Register', async (req, res) => {
  try {
    const { folderId, method, url, headers, body, authType } = req.body;

    // Validación básica
    if (!method || !url) {
      return res.status(400).json({ status: 'fail', message: 'Method and URL are required' });
    }

    const newEndpoint = new Endpoint({ folderId, method, url, headers, body, authType });
    const saved = await newEndpoint.save();

    res.status(201).json({
      status: 'success',
      message: 'Endpoint created successfully',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error creating endpoint', error: err.message });
  }
});



// ✅ GET /api/endpoints/folder/:folderId - Get endpoints by folder
router.get('/folder/:folderId', async (req, res) => {
  try {
    const endpoints = await Endpoint.find({ folderId: req.params.folderId }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      message: 'Endpoints retrieved successfully',
      data: endpoints
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error fetching endpoints by folder', error: err.message });
  }
});



// ✅ GET /api/endpoints/:id - Get single endpoint
router.get('/:id', async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);
    if (!endpoint) {
      return res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Endpoint retrieved successfully',
      data: endpoint
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error fetching endpoint', error: err.message });
  }
});



// ✅ PUT /api/endpoints/:id - Update endpoint
router.put('/:id', async (req, res) => {
  try {
    const updated = await Endpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Endpoint updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error updating endpoint', error: err.message });
  }
});




// ✅ DELETE /api/endpoints/:id - Delete endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Endpoint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Endpoint deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error deleting endpoint', error: err.message });
  }
});


module.exports = router;
