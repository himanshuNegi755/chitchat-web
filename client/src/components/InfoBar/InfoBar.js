import React from 'react';

import './InfoBar.css';

const InfoBar = ({ room, noOfMemberInRoom, showMemebers }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <p>{room}</p>
      <div className="onlineIcon"></div>
      <i className="fas fa-users chat-memNo" onClick={showMemebers}></i> <p>{noOfMemberInRoom}</p>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><i class="fas fa-times"></i></a>
    </div>
  </div>
);

export default InfoBar;
