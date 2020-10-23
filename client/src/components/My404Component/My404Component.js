import React from "react";

import './My404Component.css';

const My404Component = ({ user }) => {

  return (
    <div className='pagebody'>
      <a href='/home'>
        <span className="text-3d">404</span>
      </a>
      <span className="caption">Click to Return Home</span>
    </div>
  );
}


export default My404Component;
