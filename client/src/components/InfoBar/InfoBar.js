import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room, noOfMemberInRoom }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <p>{room}</p>
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <p>{noOfMemberInRoom}</p>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;
