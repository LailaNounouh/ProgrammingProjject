import React from "react";  
import Header from "../components/layout/Header";
import "./Login.css"; 

export default function Login() {
  return (
    <div className="login">
      <Header />
      <div className="login-content">
        <h1>Inloggen als:</h1>
        <div className="login-options">
          <button className="login-button">Student</button>
          <button className="login-button">Docent</button>
          <button className="login-button">Beheerder</button>
        </div>
      </div>
    </div>
  );
}

