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
      } else {
        return callback("room doesn't exist, pls check url.");
      }

    } catch(e) {
      return callback("room doesn't exist, pls check url.");
    }

    const { error, user } = addUser({ id: socket.id, userName, roomId, room });
    if(error) return callback(error);

    socket.join(user.roomId);

    //update members in room when somebody joins the room
    Room.updateOne({_id: ObjectId(user.roomId)}, {$set: {"members": getUsersInRoom(user.roomId).length}}, function(err, status) {
      if (err) {
        console.log('some error occured while updating members');
      } else {
        //console.log('members updated');
      }
    });

    setTimeout(function(){
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.roomId).emit('message', { user: 'admin', text: `${user.name} has joined!` });
      io.to(user.roomId).emit('roomData', { room: user.roomId, users: getUsersInRoom(user.roomId) });
    }, 500);

    callback();
  });

  socket.on('sendMessage', ({message, messageReply}, callback) => {
    const user = getUser(socket.id);

    //add messages in chat collection to the particular room
    Chat.updateOne({roomId: ObjectId(user.roomId)}, {$push: {chat: {user: user.name, text: message, replyUser: messageReply.user, replyText: messageReply.text, replyMsgId: messageReply._id}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      } else {
        //response.send(chat);
        //console.log('message sent');
      }
    });

    io.to(user.roomId).emit('message', { user: user.name, text: message , replyUser: messageReply.user, replyText: messageReply.text, replyMsgId: messageReply._id});

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      /*if(getUsersInRoom(user.roomId).length <=0) {
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

          //console.log('room deleted and chats too');
        }
      })
    } else {
      //update members in room when somebody leaves the room and if it is not the last person
      Room.updateOne({_id: ObjectId(user.roomId)}, {$set: {"members": getUsersInRoom(user.roomId).length}}, function(err, status) {
        if (err) {
          //response.status(500).send({error: "Could not update room members"});
          console.log('some errore occured while updating members');
        } else {
          //response.send(status);
          //console.log('members updated');
        }
      })
    }*/

      io.to(user.roomId).emit('message', { user: 'admin', text: `${user.name} has left.` });
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
