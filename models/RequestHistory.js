const mongoose = require('mongoose');

const requestHistorySchema = new mongoose.Schema({
  endpointId: { type: mongoose.Schema.Types.ObjectId, ref: 'Endpoint', required: true },
  environmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Environment' },
  statusCode: Number,
  response: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestHistory', requestHistorySchema);
