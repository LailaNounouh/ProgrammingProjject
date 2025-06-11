import React from 'react';
import { Link } from 'react-router-dom';

import './AdminHeader.css';

const AdminHeader = () => {
return (
<header className="header">
<Link to="/" className="logo-link">
<div className="logo">
erasmus<br />
<small>Hogeschool Brussel</small>
</div>
</Link>

<h1 className="admin-title">Admin</h1>

<nav>
<ul>
<li><Link to="/admin/bedrijven">Deelnemende bedrijven</Link></li>
<li><Link to="/admin/standen">Beheer van standen</Link></li>
<li><Link to="/admin/users">Beheer van gebruikers</Link></li>
<li><Link to="/admin/stats">Statistieken</Link></li>
</ul>
</nav>

<div className="hamburger">≡</div>
</header>
);
};

export default AdminHeader;