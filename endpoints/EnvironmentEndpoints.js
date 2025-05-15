const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');

// POST /api/environments - Create environment
router.post('/register', async (req, res) => {
  try {
    const { projectId, name, baseUrl } = req.body;

    // Validación básica
    if (!projectId || !name) {
      return res.status(400).json({ success: false, message: 'Project ID and name are required' });
    }

    const newEnv = new Environment({ projectId, name, baseUrl });
    const saved = await newEnv.save();

    res.status(201).json({ success: true, message: 'Environment created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating environment', error: err.message });
  }
});



// GET /api/environments/:projectId - Get environments by project
router.get('/:projectId', async (req, res) => {
  try {
    const environments = await Environment.find({ projectId: req.params.projectId });
    res.status(200).json({ success: true, message: 'Environments retrieved successfully', data: environments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching environments', error: err.message });
  }
});



// PUT /api/environments/:id - Update environment
router.put('/:id', async (req, res) => {
  try {
    const { name, baseUrl } = req.body;
    if (!name && !baseUrl) {
      return res.status(400).json({ success: false, message: 'At least one field (name or baseUrl) is required to update' });
    }

    const updated = await Environment.findByIdAndUpdate(
      req.params.id,
      { name, baseUrl },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Environment not found' });
    }

    res.status(200).json({ success: true, message: 'Environment updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating environment', error: err.message });
  }
});

// DELETE /api/environments/:id - Delete environment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Environment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Environment not found' });
    }

    res.status(200).json({ success: true, message: 'Environment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting environment', error: err.message });
  }
});

module.exports = router;
