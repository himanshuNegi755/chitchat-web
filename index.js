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

var Room = mongoose.model('Room');
var Chat = mongoose.model('Chat');

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

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    /*Room.updateOne({title: user.room}, {$set: {"members": getUsersInRoom(user.room).length}}, function(err, status) {
      if (err) {
        //response.status(500).send({error: "Could not update room members"});
        console.log('some errore occured while updating members');
      } else {
        //response.send(status);
        console.log('members updated');
      }
    });*/
    
    /*Chat.updateOne({roomId: '5f8c5de722e5fe4ea8c47bbb'}, {$push: {chat: {userName: 'admin', message: `welcome to room ${user.room}.`}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      } else {
        //response.send(chat);
        console.log('message sent');
      }
    });*/
    
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    
    /*Chat.updateOne({roomId: '5f8c5de722e5fe4ea8c47bbb'}, {$push: {chat: {userName: 'admin', message: `${user.name} has joined!`}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      } else {
        //response.send(chat);
        console.log('message sent');
      }
    });*/
    
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    //io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    /*Chat.updateOne({roomId: '5f8d866d12c28951e04050b9'}, {$push: {chat: {user: user.name, text: message}}}, function(err, chat) {
      if (err) {
        //response.status(500).send({error: "Could not update the menu"});
        console.log('error occurred while sending msg');
      } else {
        //response.send(chat);
        console.log('message sen');
      }
    });*/    
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    /*if(getUsersInRoom(user.room).length <=0) {
      Room.deleteOne({title: user.room}, function(err, status) {
        if (err) {
          //response.status(500).send({error: "Could not remove the room"});
          console.log('some errore occured');
        } else {
          //response.send(status);
          console.log('room deleted');
        }
      })
    } else {
      Room.updateOne({title: user.room}, {$set: {"members": getUsersInRoom(user.room).length}}, function(err, status) {
        if (err) {
          //response.status(500).send({error: "Could not update room members"});
          console.log('some errore occured while updating members');
        } else {
          //response.send(status);
          console.log('members updated');
        }
      })
    }*/

    if(user) {
      
      Chat.updateOne({roomId: '5f8c5de722e5fe4ea8c47bbb'}, {$push: {chat: {user: 'admin', text: `${user.name} has left.`}}}, function(err, chat) {
        if (err) {
          //response.status(500).send({error: "Could not update the menu"});
          console.log('error occurred while sending msg');
        } else {
          //response.send(chat);
          console.log('message sent');
        }
      });
      
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 8000, () => console.log(`Server has started.`));