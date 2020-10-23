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

const ENDPOINT = 'http://localhost:8000/';

let socket;

const Chat = ({ location, user }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  //const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const { name, room, roomId } = queryString.parse(location.search);
    
    if(user) {      
      socket = io(ENDPOINT);

      setRoom(room);
      setName(name)
      setRoomId(roomId);

      socket.emit('join', { name, room, roomId }, (error) => {
        if(error) {
          alert(error);
        }
      });

      axios.get(`${process.env.REACT_APP_BACKEND_API}/chat/${roomId}`)
      .then(res => { setMessages(res.data) })
    } else if (user === false) {
      setLoggedIn(false)
    }
    
  }, [location.search, user]);

  useEffect(() => {
    if(user) {
      socket.on('message', message => {
        setMessages(messages => [ ...messages, message ]);
      });
    }
    /*socket.on("roomData", ({ users }) => {
      setUsers(users);
    });*/
}, [user]);
  
  //component unmount
  useEffect(() => {
    if(user) {
      return () => socket.close();
    }
  },[user])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else {
    return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
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