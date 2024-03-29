import React, { useEffect, useRef } from 'react';
import ReactEmoji from 'react-emoji';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, userInRoom, msgReply, resetMsg, typing }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    showReply();
    inputRef.current.focus();
  });

  const handleInputChange = (e) => {
    let value = e.target.value;
    let tempArr = value.split(" ");
    var popup = document.getElementById("popupMsg1");
    if(tempArr[tempArr.length -1] === '@') {
      popup.style.display = 'inline-block';
    } else {
      popup.style.display = 'none';
    }
    setMessage(value);
  }

  const getUserInRoom = () => {
    var popup = document.getElementById("popupMsg1");
    const list = userInRoom.map((item) => <div key={item} className='groups' onClick={() => {
                                    let temp = message.concat(item);
                                    temp = temp.concat(" ");
                                    setMessage(temp);
                                    popup.style.display = 'none';
                                    inputRef.current.focus();
                                  }}> {item} </div> );
    return (list);
  }

  const showReply = () => {
    var popup = document.getElementById("popupMsg2");
    if(msgReply.user === '' && msgReply.text === '') popup.style.display = 'none';
    else {popup.style.display = 'inline-block';}
  }

  const closeReply = () => {
    var popup = document.getElementById("popupMsg2");
    popup.style.display = 'none';
    resetMsg();
  }
  
  //clear all @userName when message is sent
  const clearTagOnSending = (event) => {
    sendMessage(event)
    var popup = document.getElementById("popupMsg1");
    popup.style.display = 'none';
  }

  return (
    <div>
      <div className="popup-name" id='popupMsg1' style={{display:"none"}}>
        {getUserInRoom()}
      </div>
      <div className="popup-msg" id='popupMsg2' style={{display:"none"}}>
        <div className="row nameIndc">
          <div className="col-11">{msgReply.user === '' ? null : msgReply.user}</div>
          <div className="col-1 cross-icon"><i className="fas fa-times" onClick={closeReply}></i></div>
        </div>
        <div className="msgTo-reply">{msgReply.text === '' ? null : ReactEmoji.emojify(msgReply.text)}</div>
      </div>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleInputChange(e)}
          onKeyPress={event => event.key === 'Enter' ? clearTagOnSending(event) : null}
          ref={inputRef}
          onKeyUp={typing}
        />
        <button className="sendButton" onClick={e => sendMessage(e)}><span>Send</span> <i className="fas fa-chevron-right"></i></button>
      </form>
    </div>
  )
}

export default Input;
