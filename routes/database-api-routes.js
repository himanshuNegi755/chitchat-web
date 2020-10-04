const router = require('express').Router();
var mongoose = require('mongoose');

// model
var UserInterests = mongoose.model('UserInterests');
var Interests = mongoose.model('Interests');

//post/add new interests
router.post('/interests/add', function(request, response, next) {
  var tempInterests = new Interests();
    tempInterests.interests = request.body.interests;
    tempInterests.save(function(err, savedInterests) {
        if (err) {
            response.status(500).send({error:"Could not save new Interests"});
        } else {
            response.send(savedInterests);
        }
    });
});

//remove/delete already followed interests
router.put('/interests/delete', function(request, response, next) {
  Interests.remove({interests: request.body.interests}, function(err, interests) {
    if (err) {
      response.status(500).send({error: "Could not remove the interests"});
    } else {
      response.send(interests);
    }
  })
});

router.get('/interests', function(request, response, next) {
   Interests.find({}, function(err, interests) {
        if(err) {
            response.status(500).send({error: "Could not fetch interests"});
        } else {
            response.send(interests);
        }
    }); 
});

///////////////////////////////////////// users ///////////////////////////////////////////////////////////

//post/add new user interests
router.put('/user-interests/add', function(request, response, next) {
  UserInterests.updateOne({userEmail: request.body.userEmail}, {$addToSet: {interests: request.body.interests}}, function(err, interests) {
    if (err) {
      response.status(500).send({error: "Could not add user interests"});
    } else {
      response.send(interests);
    }
  });
});

//remove/delete already followed user interests
router.put('/user-interests/delete', function(request, response, next) {
  UserInterests.updateOne({userEmail: request.body.userEmail}, {$pull : {"interests": {$in : request.body.interests}}}, function(err, interests) {
    if (err) {
      response.status(500).send({error: "Could not remove the user interests"});
    } else {
      response.send(interests);
    }
  })
});

//get the interest of a particular user
router.get('/user-interests/:userEmail', function(request, response, next) {
  UserInterests.find({userEmail: request.params.userEmail}, {_id:0, "interests": 1}).exec(function(err, interestsList) {
    if(err) {
      response.status(500).send({error: "Could not get the interests"});
    } else {
      response.send(interestsList[0].interests);
    }
  });
});
    
module.exports = router;