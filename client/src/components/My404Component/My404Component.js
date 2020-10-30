import React from "react";

import './My404Component.css';

const My404Component = () => {

  return (
    <div className='pagebody'>
      <a href='/home'>
        <span className="text-3d">404</span>
      </a>
      <span className="caption">Page Not Found, Click to Return Home</span>
    </div>
  );
}


export default My404Component;
