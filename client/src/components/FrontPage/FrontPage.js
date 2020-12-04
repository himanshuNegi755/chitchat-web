import React from "react";
import { connect } from 'react-redux';
//import { Button } from 'react-bootstrap';

import './FrontPage.css';
import Introduction from './Introduction/Introduction';
import Home from './Home/Home';

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
                return (<Introduction />)
            default:
                return (
                  <div>
                    <Home />
                  </div>
                )
        }
    }

  return (
    <div className='main-div frontPage-div'>
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
