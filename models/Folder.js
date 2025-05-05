const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Folder', folderSchema);
