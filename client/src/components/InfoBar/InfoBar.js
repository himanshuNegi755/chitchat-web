import React from 'react';

import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room, noOfMemberInRoom }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <p>{room}</p>
      <div className="onlineIcon"></div>
      <i className="fas fa-users chat-memNo"></i> <p>{noOfMemberInRoom}</p>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;
