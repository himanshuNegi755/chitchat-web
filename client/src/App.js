import React from 'react';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';
import FrontPage from './components/FrontPage/FrontPage';
import Topics from './components/Topics/Topics.js';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={FrontPage} />
      <Route path="/topics" component={Topics} />
      <Route path="/join" component={Join} />
      <Route path="/chat" component={Chat} />
    </Router>
  );
}

export default App;