const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/projectn6');

const userSchema = mongoose.Schema({
  name: String,
  luckyname: String,
  email: String,
  username: String,
  password: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  prfimg: String,
  about: String,
  contact: String,
  msgs: []
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
