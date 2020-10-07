const router = require('express').Router();
var mongoose = require('mongoose');

// model
var UserInterests = mongoose.model('UserInterests');
var Interests = mongoose.model('Interests');
var Room = mongoose.model('Room');

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

//remove/delete interests from list
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

//////////////////////////////////////// room ////////////////////////////////////////////////////////////

//post/create new room
router.post('/room/create', function(request, response, next) {
  var tempRoom = new Room();
    tempRoom.title = request.body.title;
    tempRoom.language = request.body.language;
    tempRoom.members = request.body.members;
    tempRoom.access = request.body.access;
    tempRoom.category = request.body.category;
  
    tempRoom.save(function(err, room) {
        if (err) {
            response.status(500).send({error:"Could not create room"});
        } else {
            response.send(room);
        }
    });
});

//remove/delete room from db
router.put('/room/delete', function(request, response, next) {
  Room.removeOne({title: request.body.title}, function(err, status) {
    if (err) {
      response.status(500).send({error: "Could not remove the room"});
    } else {
      response.send(status);
    }
  })
});

//get the rooms for particular interests/category
router.get('/room/:interests', function(request, response, next) {
  Room.find({category: request.params.interests}, function(err, roomList) {
    if(err) {
      response.status(500).send({error: "Could not get the rooms"});
    } else {
      response.send(roomList);
    }
  });
});
    
module.exports = router;