import React, { useRef } from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, userInRoom }) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    let value = e.target.value;
    let tempArr = value.split(" ");
    var popup = document.getElementById("popupMsg");
    if(tempArr[tempArr.length -1] === '@') {
      popup.style.display = 'inline-block';
    } else {
      popup.style.display = 'none';
    }

    setMessage(value);

  }

  const getUserInRoom = () => {
    var popup = document.getElementById("popupMsg");
    const list = userInRoom.map((item) => <div key={item} className='groups' onClick={() => {
                                    let temp = message.concat(item);
                                    temp = temp.concat(" ");
                                    setMessage(temp);
                                    popup.style.display = 'none';
                                    inputRef.current.focus();
                                  }}> {item} </div> );
    return (list);
  }

  return (
    <div>
      <div className="popup-name" id='popupMsg' style={{display:"none"}}>
        {getUserInRoom()}
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
