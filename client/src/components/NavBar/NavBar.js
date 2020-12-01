import React, { useState, useEffect} from "react";
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import io from "socket.io-client";
import { Modal, Form } from 'react-bootstrap';

import './NavBar.css';

let socket;

const NavBar = ({ pageTitle, user }) => {
  const [showModal, setShowModal] = useState(false);

  //show modal entry field
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');

  const [categoryList, setCategoryList] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1);

  //status message for create room modal
  const [titleMsg, setTitleMsg] = useState('');
  const [languageMsg, setLanguageMsg] = useState('');
  const [categoryMsg, setCategoryMsg] = useState('');

  //language array for selection
  const [languageList] = useState(['English', 'Mandarin', 'Hindi', 'Spanish', 'French', 'Arabic', 'Bengali', 'Russian' ,'Portuguese', 'Indonesian', 'Urdu', 'German', 'Japanese', 'Swahili', 'Marathi', 'Telugu', 'Punjabi', 'Tamil', 'Turkish', 'Odia']);

  useEffect(() => {
    let isMounted = true; //to avoid memory leak problem on unmounting component, cleaning the function

    if(user) {
      socket = io(process.env.REACT_APP_SOCKET_ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']});
      socket.on('onlineUser', user => { setOnlineUsers(user.onlineUser) });

      axios.get(`${process.env.REACT_APP_BACKEND_API}/interests`)
      .then(res => { if(isMounted) setCategoryList(res.data) })

      return () => {
        socket.close();
        isMounted = false; }
    }
  }, [user]);

  const createRoom = () => {
    if(title === '') {
      setTitleMsg('Please enter Title');
    } else if (language === '') {
      setLanguageMsg('Please select Language');
    } else if (category === '') {
      setCategoryMsg('Please select Category');
    } else {
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
  }

  const showRoomCreateModalOrNot = () => {
    if(user.userName) {
      setShowModal(!showModal)
    } else {
      alert('Please First create user name in profile');
    }
  }

  const optionsForCategory = () => {
    const list = categoryList.map((item) =>
      <option value={item.interests} key={item.interests}>{item.interests}</option>
    );
    return (list);
  }

  const optionsForLanguage = () => {
    const list = languageList.map((item) =>
      <option value={item} key={item}>{item}</option>
    );
    return (list);
  }

  const showCreateRoomModal = (showModal) => {
    return(
      <div>
        <Modal
            className="create-room-modal"
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
                <Form.Control type="text" placeholder="Room Title" name='title' value={title} onChange={e => {setTitle(e.target.value)
                                                                                                             setTitleMsg('')}}/>
                <div className="noInput-msg">{titleMsg}</div>
              </Form.Group>

              <Form.Group>
                <select className="custom-select" type="text" placeholder="Language" name='language' value={language} onChange={e => {
                    setLanguage(e.target.value)
                    setLanguageMsg('')
                  }}>
                  <option value='' key='language'>language</option>
                  {optionsForLanguage()}
                </select>
                <div className="noInput-msg">{languageMsg}</div>
              </Form.Group>

              <Form.Group>
                <select className="custom-select" type="text" placeholder="category" name='category' value={category} onChange={e => {
                    setCategory(e.target.value)
                    setCategoryMsg('')
                  }}>
                  <option value='' key='category'>category</option>
                  {optionsForCategory()}
                </select>
                <div className="noInput-msg">{categoryMsg}</div>
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
    return (<Redirect to ={`/chat?room=${title}&roomId=${roomId}`}/>)
  } else {
    return (
      <div>
        <nav className="home-nav navbar navbar-expand-lg navbar-dark">
          <div className="topbar">
            <p>{ pageTitle }</p>
          </div>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#myNavigation" aria-controls="myNavigation" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span></button>

          <div className="collapse navbar-collapse" id="myNavigation">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <span className="nav-link">{onlineUsers} Users Online</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/interests">Interest</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about-us">About Us</Link>
              </li>
              <li className="nav-item">
                <button className="create-room" onClick={showRoomCreateModalOrNot}>CREATE ROOM</button>
              </li>
              <li className="nav-item">
                <a href={`${process.env.REACT_APP_BACKEND_API}/auth/logout`}>
                  <button variant="primary" className="create-room">
                    <b>LOG OUT</b>
                  </button>
                </a>
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
