var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const postModel = require('./posts');
const commentModel = require('./comment');
const messageModel = require('./messages');
const uuid = require('uuid');
const util = require('./util');

const pl = require('passport-local');

passport.use(new pl(userModel.authenticate()));

router.get('/rmv', function (req, res) {
  userModel.remove({})
    .then(function () {
      postModel.remove({})
        .then(function () {
          commentModel.remove({})
            .then(function () {
            messageModel.remove({})
            .then(function () {
              res.status(200).json({ msg: "removed !" });
            })
            })
        })
    })
})

router.get('/', function (req, res) {
  res.status(200).json({ message: "success", page: "index" });
});

router.post('/message/:receiver', isLoggedIn, function(req,res){
  userModel.findOne({username: req.session.passport.user})
    .then(function(foundUser){
    var returnedValue = foundUser.msgs.find(val => val.another === req.params.receiver)
    if(returnedValue === undefined){
      const chatid = uuid.v4()
          messageModel.create({
            author: req.session.passport.user,
            receiver: req.params.receiver,
            msg: req.body.msg,
            chatid: chatid
          }).then(function(createdMessage){
            foundUser.msgs.push({chatid: chatid, another: req.params.receiver});
            foundUser.save()
            .then(function(savedUser){
              userModel.findOne({username: req.params.receiver})
                .then(function(receiverFound){
                  receiverFound.msgs.push({chatid: chatid, another: req.session.passport.user});
                  receiverFound.save()
                  .then(function(receiverSaved){
                    res.status(200).json('done !');
                  })
                })
            })        
          })
    }
    else{
      var chatid = returnedValue.chatid;
      messageModel.create({
        author: req.session.passport.user,
            receiver: req.params.receiver,
            msg: req.body.msg,
            chatid: chatid
      })
      .then(function(createdMsg){
        res.status(200).json('done');
      })
    }
    })
});

router.get('/messages', isLoggedIn, function(req, res){
  userModel.findOne({username: req.session.passport.user})
    .then(function(loggedInUser){
      res.status(200).json(loggedInUser.msgs);
    })
});

router.get('/messages/:chatid', isLoggedIn, function(req, res){
  messageModel.find({chatid: req.params.chatid})
  .then(function(allmessages){
    res.status(200).json(allmessages);
  })
});

router.post('/post', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (userFound) {
      postModel.create({
        cntnt: req.body.cntnt,
        userid: userFound._id
      }).then(function (createdPost) {
        userFound.posts.push(createdPost);
        userFound.save().then(function (s) {
          res.status(200).json(s);
        })
      })
    })
})

router.get('/posts', isLoggedIn, function (req, res) {
  postModel.find()
    .then(function (allposts) {
      res.status(200).json(allposts);
    })
});

router.get('/post/:postid/react', isLoggedIn, function (req, res) {
  postModel.findOne({ _id: req.params.postid })
    .then(function (post) {
      if(!post.reacts.includes(req.session.passport.user)){
        post.reacts.push(req.session.passport.user);
      }
      else{
        let index = post.reacts.indexOf(req.session.passport.user);
        post.reacts.splice(index,1);
      }
      post.save().then(function (savedPost) {
        res.status(200).json(savedPost);
      })
    });
});

router.post('/comment/:postid', isLoggedIn, function (req, res) {
  let user = req.session.passport.user;
  userModel.findOne({ username: user })
    .then(function (userFound) {
      commentModel.create({
        postid: req.params.postid,
        userid: userFound._id,
        cmnt: req.body.comment
      }).then(function (commentCreated) {
        postModel.findOne({ _id: req.params.postid })
          .then(function (foundpost) {
            foundpost.comments.push(commentCreated);
            foundpost.save()
              .then(function (postSaved) {
                res.status(200).json(postSaved);
              })
          })
      })
    })
});

console.log(util.dateNikaalo());

router.post('/reg', function (req, res) {
  var naam = util.naamNikaalo();
  const usernew = new userModel({
    name: req.body.name,
    username: req.body.username,
    luckyname: naam
  });
  userModel.register(usernew, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, function () {
        res.status(200).json({ message: "successfully registered", value: u })
      })
    })
    .catch(function (err) {
      res.status(503).json({
        message: "something went wrong"
      })
    })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/failurelogin'
}), function (req, res) { });

router.get('/profile', function (req, res) {
  userModel.findOne({username: req.session.passport.user})
  .populate('posts')
  .then(function(userFound){
    res.status(200).json(userFound);
  });
});

router.get('/failurelogin', function (req, res) {
  res.status(200).json({ message: "failed" });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;