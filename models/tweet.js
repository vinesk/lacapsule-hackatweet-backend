const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  tweet: String
});

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;