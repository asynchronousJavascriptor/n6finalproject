const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  cmnt: String,
  reacts: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('comment', commentSchema);