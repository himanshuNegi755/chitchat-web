import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name, replyFun, mutedUsers, roomName }) => {
  
  const scrollToFun = (id) => {
    if (id && id !== -1) {
      console.log(id);
      var elmnt = document.getElementById(id);
      console.log(elmnt);
      elmnt.scrollIntoView({behavior: "smooth"});
      elmnt.style.backgroundColor = 'blue';
      setTimeout(function(){ elmnt.style.backgroundColor = '#D0D0D0' }, 1000);
    }
  }
  
  return (
    <ScrollToBottom className="messages" followButtonClassName="button-class">
      {messages.map((message, i) => <div key={i} id={i} onClick={() => {scrollToFun(message.replyMsgId)}}><Message message={message} name={name} mutedUsersList={mutedUsers} sendReply={replyFun} id={i} room={roomName}/></div>)}
    </ScrollToBottom>
  );
}

export default Messages;