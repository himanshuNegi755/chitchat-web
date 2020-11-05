import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import io from "socket.io-client";
import axios from 'axios';

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location, user }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);  //array of userName
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [redirectTo404, setRedirectTo404] = useState(true);

  useEffect(() => {
    const { room, roomId } = queryString.parse(location.search);
    
    if(user) { 
      socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);

      setRoom(room);
      setName(user.userName);
      setRoomId(roomId);
      const userName = user.userName;

      socket.emit('join', { userName, room, roomId }, (error) => {
        if(error) {
          alert(error);
          setRedirectTo404(false)
          //alert(error);
        } else {
          axios.get(`${process.env.REACT_APP_BACKEND_API}/chat/${roomId}`)
          .then(res => { setMessages(res.data) })
        }
      });
    } else if (user === false) {
      setLoggedIn(false)
    }
    
  }, [location.search, user]);

  useEffect(() => {
    if(user) {
      let finalArr = [];
      socket.on('message', message => { setMessages(messages => [ ...messages, message ]); });
      socket.on("roomData", ({ users }) => { 
        //converting user Object array to userName array
        finalArr = users.map( item => item.name);
        setUsers(finalArr);
      });
    }
}, [user]);
  
  //component unmount
  useEffect(() => {
    if(user) return () => socket.close();
  },[user])
  
  const sendMessage = (event) => {
    event.preventDefault();
    if(message) socket.emit('sendMessage', message, () => setMessage(''));
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else if(!redirectTo404) {
    return <Redirect to='/pageNotFound' />;
  } else {
    return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} noOfMemberInRoom={users.length}/>
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} userInRoom={users}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(Chat);