const mongoose = require('mongoose');

const endpointSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: false },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'], required: true },
  url: { type: String, required: true },
  headers: { type: Object },
  body: { type: Object },
  authType: { type: String, enum: ['None', 'Bearer', 'APIKey', 'OAuth2'], default: 'None' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Endpoint', endpointSchema);
