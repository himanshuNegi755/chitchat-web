var mongoose = require('mongoose');
var User = mongoose.model('User');

const users = [];

const addUser = ({ id, name, roomId, room, userEmail }) => {
  
  /*User.find({userEmail: userEmail}).exec(function(err, user) {
    if(err) {
      //response.status(500).send({error: "Can't find the room"});
      console.log("Can't get the user");
    } else {
      if(user[0].userName === name) {
        continue;
      } else {
        return { error: 'url is wrong, pls check the url'};
      }
    }
  });*/
  
  name = name.trim().toLowerCase();
  roomId = roomId.trim();
  room = room.trim();

  const existingUser = users.find((user) => user.roomId === roomId && user.name === name);

  if(!name || !roomId) return { error: 'Username and roomId are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, roomId, room };

  users.push(user);
  
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };