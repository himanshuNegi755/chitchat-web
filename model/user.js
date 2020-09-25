var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    userName: String,
    googleId: String,
    userEmail: String,
    userImage: String
});

mongoose.model('User', user);