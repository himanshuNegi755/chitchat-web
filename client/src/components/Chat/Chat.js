import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import io from "socket.io-client";
import axios from 'axios';
import { Modal } from 'react-bootstrap';

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location, user }) => {
  const [showModal, setShowModal] = useState(false);
  
  //room parameters
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);  //array of userName
  const [mutedUsers, setMutedUsers] = useState([]);  //array of muted userName
  
  //chat messages
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageReply, setMessageReply] = useState({'_id': '', user: '', text: ''});  //selective msg obj for reply
  //const [senderName, setSenderName] = useState('');  //sender name for msg reply
  
  //to check if url is wrong or user is logged in or not
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
    //console.log(messageReply);
    if(message) {
     socket.emit('sendMessage', {message, messageReply}, () => setMessage('')); 
    }
    resetMsg();
  }
  
  const sendReply = (msg) => msg.user === 'admin' ? null : setMessageReply(msg);
  
  const resetMsg = () => setMessageReply({'_id': '', user: '', text: ''});
  
  const showMembersModal = () => setShowModal(true);
  
  const muteUserFun = (item) => {
    let tempArr = [...mutedUsers];
    tempArr.push(item)
    setMutedUsers(tempArr); 
  }
  
  const unMuteUserFun = (item) => {
    let tempArr = mutedUsers.filter(userName => userName !== item);
    setMutedUsers(tempArr);
  }
  
  const membersList = () => {
    const list = users.map((item) =>
      <div key={item} className='groups row'>
       <div className='col-6'>{item}</div>
       <div className='col-6'>{mutedUsers.includes(item) ? <i class="fas fa-comment-slash" onClick={() => {unMuteUserFun(item)}}></i> : <i class="fas fa-comment" onClick={() => {muteUserFun(item)}}></i>}</div>
      </div>
    );

    return (list);
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else if(!redirectTo404) {
    return <Redirect to='/pageNotFound' />;
  } else {
    return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} noOfMemberInRoom={users.length} showMemebers={showMembersModal}/>
          <Messages messages={messages} name={name} replyFun={sendReply} mutedUsers={mutedUsers}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} userInRoom={users} msgReply={messageReply} resetMsg={resetMsg}/>
        </div>
        <div>
          <Modal
            size="md"
            aria-labelledby="new-room-modal"
            centered
            show={showModal}
            onHide={() => { setShowModal(!showModal) }}
            >
            <Modal.Header closeButton>
              <div className="Form-title">
                ROOM MEMBERS
              </div>
            </Modal.Header>
            <Modal.Body>
              {membersList()}
            </Modal.Body>
          </Modal>
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