const express = require('express');
const router = express.Router();
const RequestHistory = require('../models/RequestHistory');


// ✅ POST /api/history/Register - Store request metadata
router.post('/Register', async (req, res) => {
  try {
    const { endpointId, environmentId, statusCode, response } = req.body;

    // Validaciones mínimas
    if (!endpointId || !statusCode) {
      return sendResponse(res, 400, false, 'endpointId and statusCode are required');
    }

    const newHistory = new RequestHistory({
      endpointId,
      environmentId,
      statusCode,
      response
    });

    const saved = await newHistory.save();
    sendResponse(res, 201, true, 'Request history saved successfully', saved);

  } catch (err) {
    sendResponse(res, 500, false, 'Error saving request history', { error: err.message });
  }
});

// ✅ GET /api/history/endpoint/:endpointId - Get history by endpoint
router.get('/endpoint/:endpointId', async (req, res) => {
  try {
    const history = await RequestHistory.find({ endpointId: req.params.endpointId }).sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'History retrieved successfully', history);

  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching history by endpoint', { error: err.message });
  }
});

// ✅ GET /api/history/environment/:environmentId - Get history by environment
router.get('/environment/:environmentId', async (req, res) => {
  try {
    const history = await RequestHistory.find({ environmentId: req.params.environmentId }).sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'History retrieved successfully', history);

  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching history by environment', { error: err.message });
  }
});

// ✅ DELETE /api/history/:id - Delete specific history
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RequestHistory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return sendResponse(res, 404, false, 'History not found');
    }

    sendResponse(res, 200, true, 'History deleted successfully', deleted);

  } catch (err) {
    sendResponse(res, 500, false, 'Error deleting history', { error: err.message });
  }
});

module.exports = router;
