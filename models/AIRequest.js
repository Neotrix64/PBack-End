const mongoose = require('mongoose');

const aiRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputPrompt: { type: String, required: true },
  output: { type: Object },
  featureType: { type: String, enum: ['DataGeneration', 'EndpointSuggestion', 'Help'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRequest', aiRequestSchema);
