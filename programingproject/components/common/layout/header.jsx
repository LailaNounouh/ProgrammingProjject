import React from "react";
import "./st/Header.css";

export default function Header() {
  return (
    <header>
      <div className="top-bar">
        <img src="/logo.png" alt="Erasmus Logo" className="logo" />
        <div className="menu-icon">&#9776;</div>
      </div>
      <nav className="menu">
        <a href="#contact">Contact</a>
        <a href="#home">Home</a>
        <a href="#login">Login/Sign in</a>
      </nav>
    </header>
  );
}
