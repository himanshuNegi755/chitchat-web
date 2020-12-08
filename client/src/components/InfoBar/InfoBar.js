import React from 'react';

import './InfoBar.css';

const InfoBar = ({ room, noOfMemberInRoom, showMemebers, typingData, onlineStatus }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <p>{room}</p>
      <div className="onlineIcon" style={onlineStatus ? {backgroundColor: '#00ff00'} : {backgroundColor: '#ff0000'}}></div>
      <i className="fas fa-users chat-memNo" onClick={showMemebers}></i> <p>{noOfMemberInRoom}</p>
      <p className="typing-status">{typingData}</p>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><i className="fas fa-times"></i></a>
    </div>
  </div>
);

export default InfoBar;
