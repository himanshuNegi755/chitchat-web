const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./model/user');
require('./model/interests');
require('./model/userInterests');
require('./model/room');
require('./model/chat');
require('./model/report');

const keys = require('./config/keys');
const cookieSession = require('cookie-session');

require('./config/passport-setup');

const passport = require('passport');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//import routes
const authRoutes = require("./routes/auth-routes");
const databaseApiRoutes = require("./routes/database-api-routes");

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const corsOptions = {
  credentials: true,
  origin: true
}

const {ObjectId} = require('mongodb');
var Room = mongoose.model('Room');
var Chat = mongoose.model('Chat');
var noOfUserOnline = 0;
var $ipsConnected = [];
var deleteRoomTimeout = []; //array for room delete timeout var

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieSession({
    name: 'login',
    maxAge: 60*60*1000*24,  // 7*24* add later after completion of site
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

//set up routes
app.use('/api', authRoutes);
app.use('/api', databaseApiRoutes);

app.get('/', (req, res) => res.redirect(process.env.CLIENT_URI || 'http://localhost:3000'));
app.get('/interests', (req, res) => res.redirect(process.env.CLIENT_URI || 'http://localhost:3000/interests'));

io.on('connect', (socket) => {
  //user count on the basis of ip address of the user
  var $ipAddress = socket.handshake.address;
  if (!$ipsConnected.hasOwnProperty($ipAddress)) {
  	$ipsConnected[$ipAddress] = 1;
  	noOfUserOnline++;
    socket.emit('onlineUser', { onlineUser: noOfUserOnline});
  }
  var roomLanguage; //var for room language
  
  //socket connect/join function
  function socketJoinFun(roomId, msgWelcome, msgJoined) {
    //add messages in chat collection to the particular room
    Chat.updateOne({roomId: ObjectId(roomId)}, {$push: {chat: {user: 'admin', text: msgWelcome, replyUser: '', replyText: '', replyMsgId: -1}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      }
    });

    Chat.updateOne({roomId: ObjectId(roomId)}, {$push: {chat: {user: 'admin', text: msgJoined, replyUser: '', replyText: '', replyMsgId: -1}}}, function(err, chat) {
      if (err) {
        console.log('error occurred while sending msg');
      }
    });

    socket.emit('message', { user: 'admin', text: msgWelcome});
    socket.broadcast.to(roomId).emit('message', { user: 'admin', text: msgWelcome});

    socket.broadcast.to(roomId).emit('message', { user: 'admin', text: msgJoined });
    socket.emit('message', { user: 'admin', text: msgJoined});

  }

  //socket disconnect function
  function socketDisconnectFun(roomId, msgLeft) {
    //add messages in chat collection to the particular room
    Chat.updateOne({roomId: ObjectId(roomId)}, {$push: {chat: {user: 'admin', text: msgLeft, replyUser: '', replyText: '', replyMsgId: -1}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      }
    });

    io.to(roomId).emit('message', { user: 'admin', text: msgLeft });

  }

  socket.on('join',  async ({ userName, room, roomId }, callback) => {

    try {
      //check the url for changes made by users
      var errorOccured = new Promise((resolve, reject) => {
        resolve(Room.find({_id: ObjectId(roomId)}, function(err, roomArr) {
          if(err) {
            console.log("Can't find the room");
          }
          return roomArr;
          })
        )
      });

      var temp = await errorOccured;
      if(temp.length > 0) {
        if(temp[0].title !== room) return callback("room doesn't exist, pls check url.");
        else{roomLanguage = (temp[0].language).trim().toLowerCase();}
      } else {
        return callback("room doesn't exist, pls check url.");
      }

    } catch(e) {
      return callback("room doesn't exist, pls check url.");
    }

    const { error, user } = addUser({ id: socket.id, userName, roomId, room });
    if(error) return callback(error);

    socket.join(user.roomId);

    //clear the timeout for delete setTimeOut for a particular room
    clearTimeout(deleteRoomTimeout[user.roomId]);
    
    //update members in room when somebody joins the room
    Room.updateOne({_id: ObjectId(user.roomId)}, {$set: {"members": getUsersInRoom(user.roomId).length}}, function(err, status) {
      if (err) {
        console.log('some error occured while updating members');
      } else {
        //console.log('members updated');
      }
    });
    
    //switch cases for different languages while joining
    switch(roomLanguage) {
      case 'english':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'mandarin':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'hindi':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'spanish':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'french':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'arabic':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'bengali':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'russian':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'portuguese':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'indonesian':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'urdu':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'german':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'japanese':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'swahili':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'marathi':
        socketJoinFun(user.roomId, `${user.name}, स्वागत आहे रूम ${user.room} मधे`, `${user.name} आला`);
        break;
      case 'telugu':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      case 'punjabi':
        socketJoinFun(user.roomId, `${user.name}, ਕਮਰੇ ${user.room} ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ`, `${user.name} ਸ਼ਾਮਲ ਹੋ ਗਿਆ ਹੈ`);
        break;
      case 'tamil':
        socketJoinFun(user.roomId, `${user.name}, ${user.room} அறைக்குள் வருக`, `${user.name} சேர்ந்துகொண்டார்!`);
        break;
      case 'turkish':
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
        break;
      default:
        socketJoinFun(user.roomId, `${user.name}, welcome to room ${user.room}.`, `${user.name} has joined!`);
    }    
    
    io.to(user.roomId).emit('roomData', { room: user.roomId, users: getUsersInRoom(user.roomId) });

    callback();
  });

  socket.on('sendMessage', ({message, messageReply}, callback) => {
    const user = getUser(socket.id);

    //add messages in chat collection to the particular room
    Chat.updateOne({roomId: ObjectId(user.roomId)}, {$push: {chat: {user: user.name, text: message, replyUser: messageReply.user, replyText: messageReply.text, replyMsgId: messageReply.id}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      } else {
        //response.send(chat);
        //console.log('message sent');
      }
    });

    io.to(user.roomId).emit('message', { user: user.name, text: message , replyUser: messageReply.user, replyText: messageReply.text, replyMsgId: messageReply.id});

    callback();
  });

  //typing event for, typing status
  socket.on('typing', (data, callback) => {
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomId).emit('typingStatus', data);
    //io.to(user.roomId).emit('typingStatus', data);
    //callback();
  });
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      if(getUsersInRoom(user.roomId).length <=0) {
        //update members in room when somebody leaves the room and if it is not the last person
        Room.updateOne({_id: ObjectId(user.roomId)}, {$set: {"members": getUsersInRoom(user.roomId).length}}, function(err, status) {
          if (err) {
            //response.status(500).send({error: "Could not update room members"});
            console.log('some errore occured while updating members');
          } else {
            //console.log('members updated');
          }
        })
        //set 30 sec timeout for deleting room
        deleteRoomTimeout[user.roomId] = setTimeout(function() { 
          //remove the room when room is empty
          Room.deleteOne({_id: ObjectId(user.roomId)}, function(err, status) {
            if (err) {
              //response.status(500).send({error: "Could not remove the room"});
              console.log('some errore occured');
            } else {
              //remove chat
              Chat.deleteOne({roomId: ObjectId(user.roomId)}, function(err, status) {
                if (err) {
                  //response.status(500).send({error: "Could not remove the chat for this room"});
                } else {
                  //response.send(status);
                }
              })
            }
          })
        }, 30000);
      
    } else {
      //update members in room when somebody leaves the room and if it is not the last person
      Room.updateOne({_id: ObjectId(user.roomId)}, {$set: {"members": getUsersInRoom(user.roomId).length}}, function(err, status) {
        if (err) {
          //response.status(500).send({error: "Could not update room members"});
          console.log('some errore occured while updating members');
        } else {
          //console.log('members updated');
        }
      })
    }
      //switch cases for different languages while socket disconnect
      switch(roomLanguage) {
        case 'english':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'mandarin':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'hindi':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'spanish':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'french':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'arabic':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'bengali':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'russian':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'portuguese':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'indonesian':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'urdu':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'german':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'japanese':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'swahili':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'marathi':
          socketDisconnectFun(user.roomId, `${user.name} सोडुन गेला`);
          break;
        case 'telugu':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        case 'punjabi':
          socketDisconnectFun(user.roomId, `${user.name} ਛੱਡ ਗਿਆ ਹੈ`);
          break;
        case 'tamil':
          socketDisconnectFun(user.roomId, `${user.name} விட்டுவிட்டார்`);
          break;
        case 'turkish':
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
          break;
        default:
          socketDisconnectFun(user.roomId, `${user.name} has left.`);
      }
      
      io.to(user.roomId).emit('roomData', { room: user.roomId, users: getUsersInRoom(user.roomId)});
    } else {
      if ($ipsConnected.hasOwnProperty($ipAddress)) {
  		delete $ipsConnected[$ipAddress];
	    noOfUserOnline--;
	    socket.emit('onlineUser', { onlineUser: noOfUserOnline});
  	   }
    }
  })
});

server.listen(process.env.PORT || 8000, () => console.log(`Server has started.`));
