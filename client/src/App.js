import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchUser } from './store/actions/authActions';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';
import FrontPage from './components/FrontPage/FrontPage';
import Rooms from './components/Rooms/Rooms.js';
import Home from './components/Home/Home.js';

const App = (props) => {
  useEffect(() => {
    props.fetch_user();
  }, [props])
  
  return (
    <Router>
      <Route path="/" exact component={FrontPage} />
      <Route path="/interest" component={Rooms} />
      <Route path="/join" component={Join} />
      <Route path="/chat" component={Chat} />
      <Route path="/home" component={Home} />
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetch_user:() => {dispatch(fetchUser())}
    }
}

export default connect(null, mapDispatchToProps)(App);