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
          <p className="info-section">This is an online platform where you can create a room of any topic of your choice and can have dicussion with any person who's online.
          There are many social media platforms where we can interact with people over the world but most of the time you have to wait for any discussion to continue.</p>
          <p className="info-section">The steps are easy.</p>
          <ol className="steps-to-use">
            <li>Choose a genre/interest which your topic of discussion belongs to.</li>
            <li>Go to CREATE ROOM in the navigation bar at the top.</li>
            <li>Fill in few details and you are ready to go.</li>
            <li>People of same interest can join your room or you can share your room name with your friends so they can join too.</li>
          </ol>
          <p className="info-section">Be polite and respectful to everyone.</p>
        </div>
        <Footer />
    </div>
  );
}

export default Introduction;
