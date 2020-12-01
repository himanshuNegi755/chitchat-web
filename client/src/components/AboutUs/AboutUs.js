import React from "react";

import './AboutUs.css';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';
import CcLogo from '../../icons/ccLogo512.png';

const AboutUs = () => {

  const showFAQAns = (id_value) => {
        var faqAns = document.getElementById(id_value);
        var faqArw = document.getElementById("d" + id_value);
        if(faqAns.style.display === 'none'){
            faqAns.style.display = 'block';
        } else {
            faqAns.style.display = 'none';
        }
        if(faqArw.style.transform === 'rotate(0deg)'){
            faqArw.style.transform = 'rotate(180deg)';
        } else {
            faqArw.style.transform = 'rotate(0deg)';
        }
    }

  return (
    <div className="about-us">
      <NavBar pageTitle='About Us'/>
        <section className="about-section">
          <p className="welcome-heading"><img className="about-logo" src={CcLogo}/></p>
          <hr/>
            <p className="intro-text">An online realtime discussion platform.</p><br/>
            <p className="info-section">This is an online platform where you can create a room of any topic of your choice and can have dicussion with any person who's online.
            There are many social media platforms where we can interact with people over the world but most of the time you have to wait may be a few minutes or a few days for any discussion to continue.</p>
            <p className="info-section">So here are the simple steps how you can create a room for discussion in seconds.</p>
            <ol className="steps-to-use">
              <li>Go to CREATE ROOM in the navigation bar at the top.</li>
              <li>Give a name to your new room, choose a genre/interest of your discussion and select any language you are comfortable in the list.</li>
              <li>Click/tap on submit and you are good to go.</li>
              <li>People of same interest can join your room or you can share your room name with your friends so they can join too.</li>
            </ol>
            <p className="info-section">Similarly you can find any room you are interested to engage with simply by selecting your feild of interests.</p>
            <p className="info-section">The room you created will be destroyed within 30 seconds when the last person leaves the room. After the room is destroyed none of your chats are stored in any kind of server.</p>
            <p className="info-section">When you are logging in using Google account we only access your name, profile pic and email for a proper identity verification. No other data is used. We understand your privacy so no user can check your profile page. One can only see your updated unique user name.</p>
            <p className="info-section">Be polite and respectful to everyone.</p>
        </section>
        <section className="FAQ-section">
        <div className="faq-heading">
            <h1>FAQs</h1>
        </div>
        <div className="faq-list row">
                <div className="faq-list-item col-6">
                    <i className="fas fa-angle-down" style={{transform: 'rotate(0deg)'}} id="d1"></i><em onClick={() => {showFAQAns('1')}}> Where to get the rooms created by others people?</em>
                    <div className="ans" style={{display: 'none'}} id="1">
                        Go to interest page and click on it. Rooms related to that genre will be available there.
                    </div>
                </div>
                <div className="faq-list-item col-6">
                    <i className="fas fa-angle-down" style={{transform: 'rotate(0deg)'}} id="d2"></i><em onClick={() => {showFAQAns('2')}}> Why is my home showing Feed is empty all the time?</em>
                    <div className="ans" style={{display: 'none'}} id="2">
                        You need to follow some interest to get related rooms to join. Even after following few interest your feed is still empty then no room related to those genre exist at that moment. But you can always create one 😉.
                    </div>
                </div>
                <div className="faq-list-item col-6">
                    <i className="fas fa-angle-down" style={{transform: 'rotate(0deg)'}} id="d3"></i><em onClick={() => {showFAQAns('3')}}> What to do if someone is being disrespectful or texting offensive?</em>
                    <div className="ans" style={{display: 'none'}} id="3">
                        You can report there message by clicking and holding on the particular message for 1 second and a report box will popup. If somesone is spamming the group which feels annoying, you can mute that particular person and messages from that person will disappear only on your char box.
                    </div>
                </div>
                <div className="faq-list-item col-6">
                    <i className="fas fa-angle-down" style={{transform: 'rotate(0deg)'}} id="d4"></i><em onClick={() => {showFAQAns('4')}}> What happens if I get reported?</em>
                    <div className="ans" style={{display: 'none'}} id="4">
                        Getting reported will send a warning at beginning. Multiple report may result in getting a ban from using our site.
                    </div>
                </div>
                <div className="faq-list-item col-6">
                    <i className="fas fa-angle-down" style={{transform: 'rotate(0deg)'}} id="d10"></i><em onClick={() => {showFAQAns('10')}}> I still got some questions!</em>
                    <div className="ans" style={{display: 'none'}} id="10">
                        You can contact us through mail.
                    </div>
                </div>
        </div>
        </section>
        <Footer />
    </div>
  );
}

export default AboutUs;
