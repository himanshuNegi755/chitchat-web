var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var interests = new Schema({
    interests: String
});

mongoose.model('Interests', interests);