import React from 'react';
import "../Styles/Footer.css"

const Footer = () => {
  return (
    <nav className="nav-bar">
      <a href="/" className="nav-item ">
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Home</span>
      </a>
      <a href="/news" className="nav-item">
        <span className="nav-icon">💰</span>
        <span className="nav-text">News</span>
      </a>
      <a href="/tasks" className="nav-item">
        <span className="nav-icon">📝</span>
        <span className="nav-text">Tasks</span>
      </a>
      <a href="/network" className="nav-item">
        <span className="nav-icon">👥</span>
        <span className="nav-text">Network</span>
      </a>
      <a href="/wallet" className="nav-item">
        <span className="nav-icon">👛</span>
        <span className="nav-text">Wallet</span>
      </a>
    </nav>
  );
};

export default Footer;
