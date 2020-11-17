import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user, replyUser, replyText, replyMsgId }, name, mutedUsersList, sendReply, id, room }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  const conditonalMessages = () => {
    if(isSentByCurrentUser) {
      return (
        <div>
          <div className="messageContainer justifyEnd">
            <i className="fas fa-share share pr-10" onClick={ () => sendReply({ text, user, id })}></i>
            <div className="messageBox backgroundBlue">
              <p className="yourName">{trimmedName}</p>
              <div className={replyUser === '' ? null : 'justifyEnd'}>
                <div className="replied-to">
                  <div className="to-user">{replyUser === '' ? null : replyUser}</div>
                  <div className={replyUser === '' ? null : 'to-msg'}>{replyText === '' ? null : ReactEmoji.emojify(replyText)}</div>
                </div>
              </div>
              <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            </div>
          </div>
        </div>
      )
    } else {
      if( user === 'admin') {
        if(text === `${trimmedName}, welcome to room ${room}.`) {
          return (
            <div className="messageContainer justifyCenter">
              <div className="bot-text">
                <p>{text}</p>
              </div>
            </div>
          )
        } else if (text !== `${trimmedName} has joined!`) {
          if(text.includes('welcome')) {return(null)}
          else{
            return (
              <div className="messageContainer justifyCenter">
                <div className="bot-text">
                  <p>{text}</p>
                </div>
              </div>
            )
          }
        } else {return(null)}
      } else {
        if(mutedUsersList.includes(user)) {return(null)}
        else {
          return(
            <div>

              <div className="messageContainer justifyStart">
                <div className="messageBox backgroundLight">
                  <p className="theirName">{user}</p>
                  <div className={replyUser === '' ? null : "justifyStart"}>
                    <div className="reply-from">
                      <div className="to-user">{replyUser === '' ? null : replyUser}</div>
                      <div className={replyUser === '' ? null : 'to-msg'}>{replyText === '' ? null : ReactEmoji.emojify(replyText)}</div>
                    </div>
                  </div>
                  <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <i className="fas fa-reply share" onClick={ () => sendReply({ text, user, id })}></i>
              </div>
            </div>
          )
        }
      }
    }

  }

  return ( conditonalMessages() );
}

export default Message;
