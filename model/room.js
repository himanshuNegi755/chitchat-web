var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var room = new Schema({
  title: String,
  language: String,
  members: {type: Number, default: 1},
  created: {type: Date, default: Date.now},
  category: String
});

mongoose.model('Room', room);