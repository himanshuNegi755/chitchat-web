var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;

var chat = new Schema({
  roomId: ObjectId,
  roomName: String,
  chat: [{user: String, text: String, replyUser: String, replyText: String, replyMsgId: Number}]
});

mongoose.model('Chat', chat);