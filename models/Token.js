const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { type: String, enum: ['Bearer', 'APIKey', 'OAuth2'], required: true },
  value: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
