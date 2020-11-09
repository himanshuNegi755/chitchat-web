import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name, replyFun, mutedUsers }) => (
  <ScrollToBottom className="messages" followButtonClassName="button-class">
    {messages.map((message, i) => <div key={i} id={i}><Message message={message} name={name} mutedUsersList={mutedUsers} sendReply={replyFun} id={i}/></div>)}
  </ScrollToBottom>
);

export default Messages;