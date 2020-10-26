import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

import './ProfilePage.css';
import NavBar from '../NavBar/NavBar';

const ProfilePage = ({ user }) => {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    if(user) {
      setUserName(user.userName)
    } else if(user === false) {setLoggedIn(false)}
  }, [user]);

  const changeUserName = () => {
    if(userName.match("^[A-Za-z0-9]+$")) {

      axios.get(`${process.env.REACT_APP_BACKEND_API}/user-name/find/${userName}`)
      .then(res => {
        if(res.data === 0) {
          axios.put(`${process.env.REACT_APP_BACKEND_API}/user-name/update`, {
            userEmail: user.userEmail,
            userName: userName
          })
          .then(res => {
            //show userName update msg here
            setMessage('userName updated');
          })
        } else {
          setMessage('userName already exist');
        }
      })

    } else {
      setMessage('userName not accepted');
    }
  }

  const showPopup = () => {
    var popup = document.getElementById("popupMsg");
    popup.style.display = 'inline-block';
    setTimeout(function(){ popup.style.display = 'none' }, 1000);
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else {
    return (
      <div className='main-div profilePage'>
        <NavBar pageTitle='Profile Page'/>

        <div className="overlap-div image-name row">
            <div className="col-lg-3 col-md-4 image-col-div">
                <img className="profileImage" alt="profile" src={user ? user.userImage : null} />
            </div>
            <div className="col-lg-9 col-md-8 profileName">
                <h2>{user ? user.userName : null}</h2>
            </div>
        </div>

        <div className="profileDetails">
            <Form>

              <Form.Group as={Row}>
                <Form.Label column md="3" sm="4">
                  Email
                </Form.Label>
                <Col md="9" sm="8">
                  <Form.Control plaintext readOnly defaultValue={user ? user.userEmail : null} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column md="3" sm="4">
                  User Name
                </Form.Label>
                <Col md="9" sm="8">
                  <Form.Control type="text" placeholder="userName" name='userName' value={userName} onChange={e => setUserName(e.target.value)} />
                </Col>
              </Form.Group>

              <div className="popup-div"><span id='popupMsg'> {message} </span></div>

            </Form>
          <div className="profile-submit"><button className="submitBtn" onClick={ () => {changeUserName()
                                                                                        showPopup()}}> Submit </button></div>
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

export default connect(mapStateToProps)(ProfilePage);
