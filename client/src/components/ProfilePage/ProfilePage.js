import React from "react";
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';

const ProfilePage = ({ user }) => {

  return (
    <div className='main-div'>
      <h1>profile page</h1>
      
      <div className="overlap-div">
        <div className="aling-name-and-image row">
            <div className="col image-col-div">
                <img className="profile-image" alt="profile" src={user.userImage} />
            </div>
            <div className="col name-col-div">
                <h5>{user.userName}</h5>
            </div>
        </div>
      </div>
                
      <div className="row">
        <div className="col-1"></div>
        <div className="col-9">       
          <Form>
            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={user.userEmail} />
              </Col>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>UserName</Form.Label>
              <Form.Control as="textarea" rows="3" placeholder="Address" className="address-text-area"/>
            </Form.Group>

          </Form>
        </div>
        <div className="col-2">
        </div>

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
