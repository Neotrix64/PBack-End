const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Endpoint = require('../models/Endpoint');

// ✅ POST /api/folders/Register - Crear folder
router.post('/Register', async (req, res) => {
  try {
    const { projectId, name } = req.body;

    // Validación simple
    if (!projectId || !name) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and name are required',
      });
    }

    const folder = new Folder({ projectId, name });
    const saved = await folder.save();

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: err.message,
    });
  }
});

// ✅ GET /api/folders/:projectId - Obtener folders por proyecto
router.get('/:projectId', async (req, res) => {
  try {
    const folders = await Folder.find({ projectId: req.params.projectId });

    res.status(200).json({
      success: true,
      message: 'Folders retrieved successfully',
      data: folders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: err.message,
    });
  }
});

// ✅ PUT /api/folders/:id - Renombrar folder
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const updated = await Folder.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Folder updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating folder',
      error: err.message,
    });
  }
});

// ✅ DELETE /api/folders/:id - Eliminar folder y sus endpoints
router.delete('/:id', async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    await Endpoint.deleteMany({ folderId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Folder and related endpoints deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
      error: err.message,
    });
  }
});

module.exports = router;
