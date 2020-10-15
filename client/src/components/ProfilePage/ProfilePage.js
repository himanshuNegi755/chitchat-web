import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';

import './ProfilePage.css';

const ProfilePage = ({ user }) => {  
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if(user) {
      setUserName(user.userName)
    }
  }, [user]);

  return (
    <div className='main-div profilePage'>
      <div className="topbar"><h2>Profile Page</h2></div>

      <div className="overlap-div image-name row">
          <div className="col-2 image-col-div">
              <img className="profileImage" alt="profile" src={user ? user.userImage : null} />
          </div>
          <div className="col-10 profileName">
              <h2>{user ? user.userName : null}</h2>
          </div>
      </div>

      <div className="profileDetails">
          <Form>

            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={user ? user.userEmail : null} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                User Name
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="userName" name='userName' value={userName} onChange={e => setUserName(e.target.value)} />
              </Col>
            </Form.Group>
            <div className="profile-submit"><button className="submitBtn"> Submit </button></div>
          </Form>
      </div>


    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(ProfilePage);