const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: String, 
    receiver: String,
    msg: String,
    time:{
        type: Date,
        default: Date.now
    },
    chatid: String
});

module.exports = mongoose.model('message', messageSchema);