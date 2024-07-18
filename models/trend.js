const mongoose = require("mongoose");

const trendsSchema = mongoose.Schema({
  hashtag: String,
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tweets' }],
});

const Trend = mongoose.model("trend", trendsSchema);

module.exports = Trend;