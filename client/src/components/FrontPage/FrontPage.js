import React, { useState, useEffect } from "react";

import './FrontPage.css';
import GoogleButton from './GoogleButton/GoogleButton';
import Interests from './Interests/Interests';

const FrontPage = () => {
  return (
    <div className='main-div'>
      <GoogleButton />
      <div>
        <Interests />
      </div>
    </div>
  );
}

export default FrontPage;