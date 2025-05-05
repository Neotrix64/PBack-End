const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  baseUrl: { type: String }
});

module.exports = mongoose.model('Environment', environmentSchema);
