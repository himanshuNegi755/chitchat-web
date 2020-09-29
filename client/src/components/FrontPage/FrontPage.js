import React, { useState, useEffect } from "react";

import GoogleButton from './GoogleButton/GoogleButton';
import Interests from './Interests/Interests';

const FrontPage = () => {
  return (
    <div>
      <GoogleButton />
      <div>
        <Interests />
      </div>
    </div>
  );
}

export default FrontPage;