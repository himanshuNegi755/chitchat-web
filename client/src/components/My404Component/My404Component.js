import React from "react";

import './My404Component.css';

const My404Component = () => {

  return (
    <div className='pagebody'>
      <div className="not-found-box">
        <div className="not-found">Page Not Found</div>
        <p>Looks like the page doesn't exist.</p>
        <div className="return-button">
          <a href='/'><button>Return to Home</button></a>
        </div>
      </div>
    </div>
  );
}


export default My404Component;
