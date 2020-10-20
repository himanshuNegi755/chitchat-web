const router = require('express').Router();
var mongoose = require('mongoose');

// model
var UserInterests = mongoose.model('UserInterests');
var Interests = mongoose.model('Interests');
var Room = mongoose.model('Room');
var User = mongoose.model('User');
var Chat = mongoose.model('Chat');

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

//post/create new room and new chat for that room
router.post('/room/create', function(request, response, next) {
  var tempRoom = new Room();
    tempRoom.title = request.body.title;
    tempRoom.language = request.body.language;
    tempRoom.category = request.body.category;
  
    tempRoom.save(function(err, room) {
        if (err) {
            response.status(500).send({error:"Could not create room"});
        } else {
  
          new Chat({roomId: room._id, roomName: room.title}).save().then((newChat) => {
            console.log('chat updated');
          })
          
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
    
//this is how to pass array in url get request or any request
//get the rooms by array of interests for home page
router.get('/room', function(request, response, next) {
  Room.find({category: {$in: request.query.interests}}, function(err, roomList) {
    if(err) {
      response.status(500).send({error: "Could not get the rooms"});
    } else {
      response.send(roomList);
    }
  });  
});

////////////////////////////////////// profile ///////////////////////////////////////////////////////////

//change/update the userName
router.put('/user-name/update', function(request, response, next) {
  User.updateOne({userEmail: request.body.userEmail}, {$set: {"userName": request.body.userName}}, function(err, userName) {
    if (err) {
      //const error = new Error('Could not update the menu Item');
      //next(error);
      response.status(500).send({error: "Could not update the userName"});
    } else {
      response.send(userName); 
    }
  });
});

//check if userName exist or not, sending response in string
router.get('/user-name/find/:userName', function(request, response, next) {
  User.find({userName: request.params.userName}).countDocuments().exec(function(err, userName) {
    if(err) {
      response.status(500).send({error: "Could not get the userName"});
    } else {
      response.send(userName.toString());
    }
  });  
});

////////////////////////////////////// chat /////////////////////////////////////////////////////////////

//add messages in chat collection
router.put('/chat/add-message', function(request, response, next) {
  Chat.updateOne({roomId: request.body.roomId}, {$push: {chat: {userName: request.body.userName, message: request.body.message}}}, function(err, chat) {
    if (err) {
      //const error = new Error('Could not update the menu');
      //next(error);
      response.status(500).send({error: "Could not update the menu"});
    } else {
        response.send(chat);
    }
  });
});

//delete/remove room chat from collection
router.put('/chat/delete', function(request, response, next) {
  Room.removeOne({roomId: request.body.roomId}, function(err, status) {
    if (err) {
      response.status(500).send({error: "Could not remove the chat for this room"});
    } else {
      response.send(status);
    }
  })
});

//get all messages from chat collection for room
router.get('/chat/:roomId', function(request, response, next) {
  Chat.find({roomId: request.params.roomId}, {_id: 0, chat: 1}).exec(function(err, chat) {
    if(err) {
      //const error = new Error('No Menu For this Shop');
      //next(error);
      response.status(500).send({error: "No Chat For this Room"});
    } else {
      response.send(chat[0].chat);
    }
  });
});

module.exports = router;