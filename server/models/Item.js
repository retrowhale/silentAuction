const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  currentBid: Number,
  imageUrl: String,
  endTime: Date
});

module.exports = mongoose.model('items', itemSchema);
