const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');

// POST /api/environments - Create environment
router.post('/Register', async (req, res) => {
  try {
    const { projectId, name, baseUrl } = req.body;

    const newEnv = new Environment({
      projectId,
      name,
      baseUrl
    });

    const saved = await newEnv.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating environment', details: err.message });
  }
});

// GET /api/environments/:projectId - Get environments by project
router.get('/:projectId', async (req, res) => {
  try {
    const environments = await Environment.find({ projectId: req.params.projectId });
    res.json(environments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching environments', details: err.message });
  }
});

// PUT /api/environments/:id - Update environment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Environment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Environment not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating environment', details: err.message });
  }
});

// DELETE /api/environments/:id - Delete environment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Environment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Environment not found' });
    }
    res.json({ message: 'Environment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting environment', details: err.message });
  }
});

module.exports = router;
