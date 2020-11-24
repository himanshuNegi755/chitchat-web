import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name, replyFun, mutedUsers, roomName, reportModal }) => {
  
  const scrollToFun = (id) => {
    if (id && id !== -1) {
      var elmnt = document.getElementById(id);
      elmnt.scrollIntoView({behavior: "smooth"});
      elmnt.style.backgroundColor = '#808080';
      setTimeout(function(){ elmnt.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                              elmnt.style.transition = '0.5s';}, 1000);
    }
  }

  return (
    <ScrollToBottom className="messages" followButtonClassName="button-class">
      {messages.map((message, i) => <div key={i} id={i}><Message message={message} name={name} mutedUsersList={mutedUsers} sendReply={replyFun} id={i} room={roomName} scrollToMsg={scrollToFun} report={reportModal}/></div>)}
    </ScrollToBottom>
  );
}

export default Messages;
