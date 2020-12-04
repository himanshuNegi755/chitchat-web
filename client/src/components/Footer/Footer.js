import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="container-fluid contact-details">
            <h4 className="contact-us">CONTACT US</h4>
            <p className="contact-text">For any queries please mail us and we will reply as soon as possible with a solution.</p>
            <a className="contact-icons" href="mailto:thekatohome@gmail.com"><i className="fas fa-envelope fa-2x" aria-hidden="true"></i> </a>
            <hr className="contact-divider"></hr>
            <p className="copyright">© COPYRIGHT 2020 CHIT-CHAT.</p>
        </div>
    </footer>
  );
}
export default Footer;
