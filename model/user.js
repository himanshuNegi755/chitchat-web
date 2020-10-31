var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
  userName: String,
  googleId: String,
  userEmail: String,
  userImage: String,
  userIsNew: {type: Boolean, default: true}
});

mongoose.model('User', user);