import React, { useState, useEffect } from 'react';
import { FaEuroSign, FaCalendarAlt, FaMapMarkerAlt, FaCog, FaChevronRight, FaSearch, FaBell } from 'react-icons/fa';
import './BedrijvenDashboard.css';

function BedrijvenDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);

  useEffect(() => {
    setBetalingen([
      { id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }
    ]);
    setAfspraken([]);
  }, []);

  return (
    <div className="bedrijven-dashboard">
      {}
    </div>
  );
}

export default BedrijvenDashboard;
