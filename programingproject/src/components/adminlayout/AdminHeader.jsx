import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHeader.css';

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <h2>Admin</h2>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/users">Gebruikers</Link></li>
          <li><Link to="/admin/settings">Instellingen</Link></li>
        </ul>
      </nav>
    </header>
  );
}