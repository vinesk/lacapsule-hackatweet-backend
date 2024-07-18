var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweet");
const User = require("../models/users");


router.post('/addTweet', (req, res) => {

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
            res.json({ result: false, error: 'pas de user' });
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
        for (let e of dataTweet) {
          dataToSendTweets.push({
            firstname: e.user.firstname,
            username: e.user.username,
            message: e.message,
            date: e.date,
            likes: e.likes,
            hashtags: e.hashtags,
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
                res.json({ result: false, error: "tweet pas trouvé" });
              }
            }); 
          } else {
            res.json({ result: false, error: "pas d'user" });
          }
        }); 
      } else {
        res.json({ result: false, error: "pas trouvé" });
      }
    });
});

module.exports = router;
