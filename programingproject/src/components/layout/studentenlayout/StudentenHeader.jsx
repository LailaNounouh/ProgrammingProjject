import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../button/logoutbutton'; 
import './StudentenHeader.css';

const userType = localStorage.getItem('userType')

const StudentenHeader = () => {
 return (
   <header className="header">
     <Link to="/" className="logo-link">
       <img
         src={`${import.meta.env.BASE_URL}afbeelding/erasmuslogo.png`}
         alt="Erasmus logo"
         className="logo"
       />
     </Link>
     <nav>
       <ul>
         <li><Link to="/student/bedrijven">Deelnemende Bedrijven</Link></li>
         <li><Link to="/student/standen">Standen</Link></li>
         <li><Link to="/student/afspraak">Afspraak maken</Link></li>
         <li><Link to="/student/profiel">Profiel</Link></li> 
         <li><Link to="/student/instellingen">Instellingen</Link></li>
         <li><LogoutButton /></li>
       </ul>
     </nav>
   </header>
 );
};


export default StudentenHeader;
