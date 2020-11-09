import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user, replyUser, replyText, replyMsgId }, name, mutedUsersList }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div>
          <div className="messageContainer justifyEnd">
            <div className={replyUser === '' ? null : 'replied-to'}>
              <div className="to-user">{replyUser === '' ? null : replyUser}</div>
              <div className={replyUser === '' ? null : 'to-msg'}>{replyText === '' ? null : ReactEmoji.emojify(replyText)}</div>
            </div>
          </div>
          <div className="messageContainer justifyEnd">
            <p className="sentText pr-10">{trimmedName}</p>
            <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            </div>
          </div>
        </div>
        )
        : ( user === 'admin'
           ? (
              <div className="messageContainer justifyCenter">
                <div className="bot-text">
                  <p className="messageText colorDark">{text}</p>
                </div>
              </div>
              )
           : ( mutedUsersList.includes(user) //blocked user
              ? (null)
              :
             (
              <div>
                <div className="messageContainer justifyStart">
                  <div className={replyUser === '' ? null : "reply-from"}>
                    <div className="to-user">{replyUser === '' ? null : replyUser}</div>
                    <div className="to-msg">{replyText === '' ? null : ReactEmoji.emojify(replyText)}</div>
                  </div>
                </div>
                <div className="messageContainer justifyStart">
                  <div className="messageBox backgroundLight">
                    <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                  </div>
                </div>
              </div>
                )
            )
        )
  );
}

export default Message;
