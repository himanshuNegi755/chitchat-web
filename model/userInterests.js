var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInterests = new Schema({
    userEmail: String,
    interests: [ {type: String} ]
});

mongoose.model('UserInterests', userInterests);