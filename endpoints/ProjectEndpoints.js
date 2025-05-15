const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Importa tus otros modelos si deseas eliminar en cascada
const Folder = require('../models/Folder');
const Endpoint = require('../models/Endpoint');
const Environment = require('../models/Environment');
// etc...

// ✅ CREATE project
router.post('/Register', async (req, res) => {
  try {
    const { userId, name, description } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ success: false, message: 'userId and name are required.' });
    }

    const project = new Project({ userId, name, description });
    const saved = await project.save();

    res.status(201).json({ success: true, message: 'Project created successfully.', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating project.', error: err.message });
  }
});

// ✅ GET all projects of a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required.' });
    }

    const projects = await Project.find({ userId });
    res.status(200).json({ success: true, message: 'Projects retrieved successfully.', data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching projects.', error: err.message });
  }
});

// ✅ GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({ success: true, message: 'Project retrieved successfully.', data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching project.', error: err.message });
  }
});

// ✅ UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required for update.' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({ success: true, message: 'Project updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating project.', error: err.message });
  }
});

// ✅ DELETE project with cascade
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Cascade delete
    const folderIds = await Folder.find({ projectId: req.params.id }).distinct('_id');
    await Endpoint.deleteMany({ folderId: { $in: folderIds } });
    await Folder.deleteMany({ projectId: req.params.id });
    await Environment.deleteMany({ projectId: req.params.id });

    res.status(200).json({ success: true, message: 'Project and related data deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting project.', error: err.message });
  }
});

module.exports = router;
