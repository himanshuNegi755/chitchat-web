import React, { useState, useEffect} from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import io from "socket.io-client";
import { Modal, Form } from 'react-bootstrap';

import './NavBar.css';

const ENDPOINT = 'http://localhost:8000/';
let socket;

const NavBar = ({ pageTitle, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState();
  const [language, setLanguage] = useState();
  const [category, setCategory] = useState();
  const [redirect, setRedirect] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  
  useEffect(() => {
    
    if(user) {      
      socket = io(ENDPOINT);
      
      socket.on('onlineUser', user => {
        setOnlineUsers(user.onlineUser);
      });
    }    
  }, [user]);
  
  const createRoom = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_API}/room/create`, {
      title: title,
      language: language,
      category: category
    })
    .then(res => {
      setRoomId(res.data._id);
      setShowModal(!showModal);
      setRedirect(true);
    })
  }
  
  const showRoomCreateModalOrNot = () => {
    if(user.userName) {
      setShowModal(!showModal)
    } else {
      alert('Please First create user name in profile');
    }
  }
  
  const showCreateRoomModal = (showModal) => {
    return(
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
              CREATE NEW ROOM
            </div>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control type="text" placeholder="Room Title" name='title' value={title} onChange={e => setTitle(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="language" name='language' value={language} onChange={e => setLanguage(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="category" name='category' value={category} onChange={e => setCategory(e.target.value)}/>
              </Form.Group>

              <div className="btn-div">
                <button type="button" className="submit-btn form-btn" onClick={createRoom}>
                  Submit
                </button>
              </div>
            </Form>

          </Modal.Body>
        </Modal>
      </div>
    )
  }
  
  if(redirect && user.userName) {
    return (<Redirect to ={`/chat?name=${user.userName}&room=${title}&roomId=${roomId}`}/>)
  } else {
    return (
      <div>
        <nav className="home-nav navbar navbar-expand-lg navbar-dark">
          <div className="topbar">
            <h2>{ pageTitle }</h2>
          </div>

          <div className="collapse navbar-collapse" id="myNavigation">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#nothing">{onlineUsers} Users Online</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">Interest</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                <button  className="create-room" onClick={showRoomCreateModalOrNot}>CREATE ROOM</button>
              </li>
            </ul>
          </div>
        </nav>

        {showCreateRoomModal(showModal)}
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(NavBar);