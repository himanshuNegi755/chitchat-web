import React, { useEffect, useRef } from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, userInRoom, msgReply }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    showReply();
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

  return (
    <div>
      <div className="popup-name" id='popupMsg1' style={{display:"none"}}>
        {getUserInRoom()}
      </div>
      <div className="popup-msg" id='popupMsg2' style={{display:"none"}}>
        <div>{msgReply.user === '' ? null : msgReply.user}</div>
        <div>{msgReply.text === '' ? null : msgReply.text}</div>
      </div>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleInputChange(e)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
          ref={inputRef}
        />
        <button className="sendButton" onClick={e => sendMessage(e)}><span>Send</span> <i className="fas fa-chevron-right"></i></button>
      </form>
    </div>
  )
}

export default Input;
