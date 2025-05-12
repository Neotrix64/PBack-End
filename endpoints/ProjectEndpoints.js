const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Importa tus otros modelos si deseas eliminar en cascada
const Folder = require('../models/Folder');
const Endpoint = require('../models/Endpoint');
const Environment = require('../models/Environment');
// etc...

// ✅ POST /api/projects - Create a new project
router.post('/Register', async (req, res) => {
  try {
    const { userId, name, description } = req.body;

    const project = new Project({
      userId,
      name,
      description
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating project', details: err.message });
  }
});

// ✅ GET /api/projects - Get all projects of a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; // o extraído del token si usás auth

    const projects = await Project.find({ userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching projects', details: err.message });
  }
});

// ✅ GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching project', details: err.message });
  }
});

// ✅ PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: 'Project not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating project', details: err.message });
  }
});

// ✅ DELETE /api/projects/:id - Delete project + cascade
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Elimina en cascada los recursos relacionados
    await Folder.deleteMany({ projectId: req.params.id });
    await Endpoint.deleteMany({ folderId: { $in: (await Folder.find({ projectId: req.params.id }).distinct('_id')) } });
    await Environment.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project and related data deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project', details: err.message });
  }
});

module.exports = router;
