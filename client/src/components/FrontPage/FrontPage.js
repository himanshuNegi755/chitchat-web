import React from "react";
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import './FrontPage.css';
import GoogleButton from './GoogleButton/GoogleButton';
import Interests from './Interests/Interests';

const FrontPage = ({ user }) => {

  const renderContent = () => {
        switch(user) {
            case null:
                return (
                    <React.Fragment>
                        <div className="btn-div">
                            <h5>Loading</h5>
                        </div>
                    </React.Fragment>
                )
            case false:
                return (<GoogleButton />)
            default:
                return (
                  <div>
                    <a href={`${process.env.REACT_APP_BACKEND_API}/auth/logout`}>
                      <Button variant="primary">
                        <b>LOG OUT</b>
                      </Button>
                    </a>
                    <div className="interest-div">
                      <Interests userEmail={user.userEmail} />
                    </div>
                  </div>
                )
        }
    }

  return (
    <div className='main-div'>
      {renderContent()}
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(FrontPage);
