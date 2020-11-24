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
var typingTimeout;  //var for typing timeout

const Chat = ({ location, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  //room parameters
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);  //array of userName
  const [mutedUsers, setMutedUsers] = useState([]);  //array of muted userName

  //chat messages
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageReply, setMessageReply] = useState({'id': -1, user: '', text: ''});  //selective msg obj for reply, and id is index of msg

  //to check if url is wrong or user is logged in or not
  const [loggedIn, setLoggedIn] = useState(true);
  const [redirectTo404, setRedirectTo404] = useState(true);
  
  //user and msg for reporting
  const [reportedUserName, setReportedUserName] = useState('');
  const [reportedMsg, setReportedMsg ] = useState('');
  const [reportStatus, setReportStatus] = useState(''); //status after reporting
  
  //typing status usestate
  const [typing, setTyping] = useState('');

  useEffect(() => {
    const { room, roomId } = queryString.parse(location.search);

    if(user) {
      socket = io(process.env.REACT_APP_SOCKET_ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']});

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
      socket.on('typingStatus', data => { setTyping(data); });
    }
}, [user]);

  //component unmount
  useEffect(() => {
    if(user) return () => socket.close();
  },[user])

  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
     socket.emit('sendMessage', {message, messageReply}, () => setMessage(''));
    }
    resetMsg();
  }

  const sendReply = (msg) => msg.user === 'admin' ? null : setMessageReply(msg);
  
  const resetMsg = () => setMessageReply({'id': -1, user: '', text: ''});
  
  //modal functions
  const showMembersModal = () => setShowModal(true);
  const showReportModal = (user, msg) => {
    setReportedUserName(user);
    setReportedMsg(msg);
    setReportModal(true); 
  }

  const muteUserFun = (item) => {
    let tempArr = [...mutedUsers];
    tempArr.push(item)
    setMutedUsers(tempArr);
  }

  const unMuteUserFun = (item) => {
    let tempArr = mutedUsers.filter(userName => userName !== item);
    setMutedUsers(tempArr);
  }

  //reporting user and his/her msg
  const reportUserMsg = () => {
    if(reportedUserName === '' && reportedMsg === '') {
      setReportStatus('Nothing to report');
    } else {
      axios.post(`${process.env.REACT_APP_BACKEND_API}/report-user`, {
        reportingUser: user.userEmail,
        reportedUser: reportedUserName,
        message: reportedMsg
      })
      .then(res => {
        setReportStatus('Reported Successfully');
      })
    }
    showPopupStatus();
  }
  
  //show report status popup
  const showPopupStatus = () => {
    var popup = document.getElementById("popupStatus");
    popup.style.display = 'inline-block';
    setTimeout(function(){ popup.style.display = 'none' }, 1000);
  }
    
  //memberlist for muting and unmuting
  const membersList = () => {
    const list = users.map((item) =>
      <div key={item} className='member-box row'>
       <div className='col-10'>{item}</div>
        <div className='col-2 mute-opt'>
          {item !== name ?  (mutedUsers.includes(item) ? <i className="fas fa-comment-slash" onClick={() => {unMuteUserFun(item)}}></i> : <i className="fas fa-comment" onClick={() => {muteUserFun(item)}}></i>) : null}
        </div>
      </div>
    );

    return (list);
  }
  
  const typingFun = () => {
    socket.emit('typing', 'typing...');
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(function() { socket.emit('typing', ''); }, 2000);
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else if(!redirectTo404) {
    return <Redirect to='/pageNotFound' />;
  } else {
    return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} noOfMemberInRoom={users.length} showMemebers={showMembersModal} typingData={typing}/>
          <div className="popup-div"><span id='popupStatus'> {reportStatus} </span></div>
          <Messages messages={messages} name={name} replyFun={sendReply} mutedUsers={mutedUsers} roomName={room} reportModal={showReportModal}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} userInRoom={users} msgReply={messageReply} resetMsg={resetMsg} typing={typingFun}/>
        </div>
        <div>
          <Modal
            size="md"
            className="list-box"
            aria-labelledby="new-room-modal"
            centered
            show={showModal}
            onHide={() => { setShowModal(!showModal) }}
            >
            <Modal.Header className="list-box-header" closeButton>
              <div className="Form-title">
                Room Members
              </div>
            </Modal.Header>
            <Modal.Body className="list-box-body">
              {membersList()}
            </Modal.Body>
          </Modal>
        </div>
        <div>
          <Modal
            size="md"
            className="list-box"
            aria-labelledby="new-room-modal"
            centered
            show={reportModal}
            onHide={() => { 
              setReportedUserName('');
              setReportedMsg('');
              setReportModal(!reportModal);
            }}
            >
            <Modal.Body className="list-box-body" onClick={() => {
                reportUserMsg();
                setReportModal(!reportModal);
              }}>
              Report
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
