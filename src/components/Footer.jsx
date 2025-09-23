import React from "react";
import { Link } from 'react-router-dom';
import "./Footer.css";
import icon from '../assets/icon.png'; // Update the path as needed

const Footer = () => (
  <footer className="footer-minimal">
    <div className="footer-minimal-content">
      <img src={icon} alt="Logo" className="footer-minimal-logo" />
      <nav className="footer-minimal-links">
        <Link to="/about">About</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="footer-minimal-copy">
        © {new Date().getFullYear()} Nanded Finder. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
