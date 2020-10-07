var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var room = new Schema({
  title: String,
  language: String,
  members: {type: Number, min: 3, max: 10, default: 10},
  access: {type: String, default: 'anyone can join'},
  created: {type: Date, default: Date.now},
  category: String
});

mongoose.model('Room', room);