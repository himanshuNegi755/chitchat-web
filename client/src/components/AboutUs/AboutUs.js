import React from "react";

import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';

const AboutUs = () => {

  return (
    <div className="before-logIn">
      <NavBar pageTitle='Profile Page'/>
        <div className="body-div">
          <p className="welcome-heading">Welcome to Chit-chat.</p>
          <hr/>
          <p className="intro-text">An online realtime discussion platform.</p>
          <p className="info-section">This is an online platform where you can create a room of any topic of your choice and can have dicussion with any person who's online.
          There are many social media platforms where we can interact with people over the world but most of the time you have to wait for any discussion to continue.</p>
          <p className="info-section">The steps are easy.</p>
          <ol className="steps-to-use">
            <li>Choose a genre/interest which your topic of discussion belongs to.</li>
            <li>Go to CREATE ROOM in the navigation bar at the top.</li>
            <li>Fill in few details and you are ready to go.</li>
            <li>People of same interest can join your room or you can share your room name with your friends so they can join too.</li>
          </ol>
          <p className="info-section">The room you created will be destroyed within a minute when the last person exits the room. After the room is destroyed none of your chats are stored in any kind of server.</p>
          <p className="info-section">When you are logging in using Google account we only access your name, profile pic and email for a proper identity verification. No other data is used. We understand your privacy so no user can check your profile page. One can only see the unique user name you update </p>
          <p className="info-section">Be polite and respectful to everyone.</p>
        </div>
        <Footer />
    </div>
  );
}

export default AboutUs;
