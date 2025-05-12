const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Endpoint = require('../models/Endpoint');

// ✅ POST /api/folders - Create a new folder in a project
router.post('/Register', async (req, res) => {
  try {
    const { projectId, name } = req.body;

    const folder = new Folder({ projectId, name });
    const saved = await folder.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating folder', details: err.message });
  }
});

// ✅ GET /api/folders/:projectId - Get all folders in a project
router.get('/:projectId', async (req, res) => {
  try {
    const folders = await Folder.find({ projectId: req.params.projectId });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching folders', details: err.message });
  }
});

// ✅ PUT /api/folders/:id - Rename a folder
router.put('/:id', async (req, res) => {
  try {
    const updated = await Folder.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Folder not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating folder', details: err.message });
  }
});

// ✅ DELETE /api/folders/:id - Delete folder and cascade delete endpoints
router.delete('/:id', async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });

    // Borrar todos los endpoints dentro del folder eliminado
    await Endpoint.deleteMany({ folderId: req.params.id });

    res.json({ message: 'Folder and related endpoints deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting folder', details: err.message });
  }
});

module.exports = router;
