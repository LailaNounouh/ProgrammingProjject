import React from 'react';
import './StudentenDashboard.css';

export default function StudentDashboard() {
  return (
    <div className="student-dashboard">
      <h2>LinkedIn toevoegen:*</h2>
      <input
        type="url"
        className="linkedin-input"
        placeholder="URL naar LinkedIn profiel"
      />

      <h3>Deelnemende bedrijven:</h3>
      <div className="company-filter">
        <button className="filter-btn">Filter ⌄</button>
      </div>

      <div className="companies-grid">
        {['Microsoft', 'Cisco', 'Sopra Steri', 'Webdoos'].map((name) => (
          <div key={name} className="company-card">
            <div className="logo-placeholder" />
            <div className="company-name">{name}</div>
            <div className="more-info">• Meer info</div>
          </div>
        ))}
      </div>

      <h3>Standen:</h3>
      <div className="booth-map">
        <div className="booth-row">
          <div className="booth gray" />
          <div className="booth gray" />
          <div className="booth buffet">Buffet</div>
        </div>
        <div className="booth-row">
          <div className="booth gray" />
          <div className="booth gray" />
          <div className="booth teal" />
        </div>
        <div className="booth-row">
          <div className="booth teal" />
          <div className="booth teal" />
          <div className="booth teal" />
        </div>
        <div className="booth-row">
          <div className="booth teal" />
          <div className="booth onthaallabel">Onthaal</div>
          <div className="booth gray" />
        </div>
      </div>
    </div>
  );
}