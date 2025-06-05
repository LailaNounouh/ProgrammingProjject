import React from "react";
import Header from "../components/layout/Header";
import "./Register.css";

export default function Register() {
  return (
    <div className="register">
      <Header />
      <div className="register-content">
        <h1>Registreren</h1>
        <p>Vul het onderstaande formulier in om je te registreren.</p>
      </div>
    </div>
  );
}
