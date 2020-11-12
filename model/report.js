var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var report = new Schema({
  reportingUser: String,
  reportedUser: String,
  message: String
});

mongoose.model('Report', report);