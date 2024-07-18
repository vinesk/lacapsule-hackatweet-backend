var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweet");
const User = require("../models/users");
const Trends = require("../models/trends");


router.post('/add', (req, res) => {

   User.findOne({ token : req.body.token}).then(dataUser => {
    console.log(dataUser)
       if(dataUser){
            const newTweet = new Tweet({
                user : dataUser.id,
                message: req.body.message,
                date: Date.now(),
                likes: [],
                hashtags: req.body.hashtags,
            });
          newTweet.save().then(newDoc => {res.json({ result: true , id : newDoc.id}) })
       }else{
            res.json({ result: false, error: 'User not find' });
       }

   })
 });


router.get("/", (req, res) => {
  const dataToSend = [];
  Tweet.find({})
    .populate("user")
    .then((dataTweet) => {
      const dataToSendTweets = [];
      if (dataTweet) {
        for (let item of dataTweet) {
          dataToSendTweets.push({
            firstName: item.user.firstName,
            userName: item.user.userName,
            message: item.message,
            date: item.date,
            likes: item.likes,
            hashtags: item.hashtags,
          });
        }
        res.json({ result: true, data: dataToSendTweets });
      } else {
        res.json({ result: false, error: "Tweets not found" });
      }
    });
});

router.post("/like", (req, res) => {
  Tweet.findOne({ message: req.body.message })
    .populate("likes")
    .then((dataTweet) => {
      if (dataTweet) {
        User.findOne({ token: req.body.token }).then((dataUser) => {
          if (dataUser) {
            let newLikes = dataTweet.likes;
           
            if (!dataTweet.likes.some((elt) => elt.id === dataUser.id)) {
            
              newLikes.push(dataUser.id);
            } else {
              newLikes = newLikes.filter((elt) => elt.id !== dataUser.id);
            }

            Tweet.findOneAndUpdate(
              { message: req.body.message },
              { $set: { likes: newLikes } }
            ).then((dataTweet) => {
              if (dataTweet) {
                res.json({ result: true });
              } else {
                res.json({ result: false, error: "Tweets not update" });
              }
            }); 
          } else {
            res.json({ result: false, error: "User not find" });
          }
        }); 
      } else {
        res.json({ result: false, error: "Tweets not found" });
      }
    });
});

module.exports = router;
