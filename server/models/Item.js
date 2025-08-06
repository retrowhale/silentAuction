// models/Item.js (example)

const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  username: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  currentBid: Number,
  highestBidder: String,        // username of highest bidder
  bids: [bidSchema],            // all bids with username and amount
  imageUrl: String,
  endTime: Date,
});

module.exports = mongoose.model('Item', itemSchema);
