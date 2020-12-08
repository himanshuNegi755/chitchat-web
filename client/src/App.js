import React, { useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchUser } from './store/actions/authActions';

import Chat from './components/Chat/Chat';
import FrontPage from './components/FrontPage/FrontPage';
import Rooms from './components/Rooms/Rooms.js';
import Interests from './components/Interests/Interests';
import ProfilePage from './components/ProfilePage/ProfilePage.js';
import My404Component from './components/My404Component/My404Component.js';
import AboutUs from './components/AboutUs/AboutUs.js';

const App = (props) => {
  useEffect(() => {
    props.fetch_user();
  }, [props])
  
  return (
    <Switch>
      <Route exact path="/" component={FrontPage} />
      <Route exact path="/rooms" component={Rooms} />
      <Route exact path="/chat" component={Chat} />
      <Route exact path="/interests" component={Interests} />
      <Route exact path="/profile" component={ProfilePage} />
      <Route exact path="/about-us" component={AboutUs} />
      <Route component={My404Component} />
    </Switch>
  );
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetch_user:() => {dispatch(fetchUser())}
    }
}

export default connect(null, mapDispatchToProps)(App);