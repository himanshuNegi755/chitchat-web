import React from "react";

import './Introduction.css';
import GoogleButton from '../GoogleButton/GoogleButton';
import Footer from '../../Footer/Footer';

const Introduction = ({ userEmail }) => {

  return (
    <div className="before-logIn">
        <div className="body-div">
          <p className="welcome-heading">Welcome to Chit-chat.</p>
          <hr/>
          <p className="intro-text">An online realtime discussion platform.</p>
          <GoogleButton />
          <p className="info-section">This is an online platform where you can create a room of any topic of your choice and can have dicussion with anyone who's online.
          There are many social media platforms where we can interact with people over the world but most of the time you have to wait for any discussion to continue.</p>
          <p className="info-section">When you are logging in using Google account we only access your name, profile pic and email for a proper identity verification. No other data is used.
          We understand your privacy, so no user can check your profile page. One can only see the unique user name you update.</p>
          <p className="info-section">Be polite and respectful to everyone.</p>
        </div>
        <Footer />
    </div>
  );
}

export default Introduction;
