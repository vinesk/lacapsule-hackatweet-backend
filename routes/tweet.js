var express = require('express');
var router = express.Router();
require('../models/connection');
const Tweet = require('../models/tweet');

router.post('/tweet', async (req, res) => {

        if (data === null) {
            return res.status(400).json({ error: 'faut écrire voyons' });
        }
        const newTweet = new Tweet({
            tweet : req.body.tweet

        });

        const savedTweet = await newTweet.save();
        res.status(201).json(savedTweet);
    })

router.get('/tweet', (req, res) => {
    res.json({ tweet: req.body.tweet})

})


module.exports = router;