import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './StudentenDashboard.css';
import { FiTrash2 } from 'react-icons/fi';

const StudentDashboard = () => {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  
  const CURRENT_USER = "simonbeelen";

  useEffect(() => {
    const fetchBedrijven = async () => {
      try {
        const response = await fetch('http://10.2.160.211:3000/api/bedrijvenmodule');
        if (response.ok) {
          const data = await response.json();
          setBedrijven(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Fout bij ophalen bedrijven:', error);
      }
    };

    const fetchAfspraken = async () => {
      if (!gebruiker?.id) return; 

      try {
        const response = await fetch(`http://10.2.160.211:3000/api/afspraken/student/${gebruiker.id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Sorteer afspraken op tijdslot (vroegste eerst)
          const gesorteerdeAfspraken = [...data].sort((a, b) => {
            const tijdA = a.tijdslot || (a.datum_tijd ? new Date(a.datum_tijd).toLocaleTimeString() : '');
            const tijdB = b.tijdslot || (b.datum_tijd ? new Date(b.datum_tijd).toLocaleTimeString() : '');
            return tijdA.localeCompare(tijdB);
          });
          
          setAfspraken(gesorteerdeAfspraken);
        } else {
          console.error('Fout bij ophalen afspraken:', await response.text());
        }
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
      }
    };

    fetchBedrijven();
    fetchAfspraken();
  }, [gebruiker]); 

  const formateerTijdslot = (datumTijd) => {
    if (!datumTijd) return '';
    
    if (datumTijd.length <= 5 && datumTijd.includes(':')) {
      return datumTijd;
    }
    
    try {
      const datum = new Date(datumTijd);
      return datum.toLocaleTimeString('nl-BE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return datumTijd;
    }
  };

  const verwijderAfspraak = async (afspraakId) => {
    if (!afspraakId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://10.2.160.211:3000/api/afspraken/${afspraakId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Direct uit de lokale state verwijderen voor betere gebruikerservaring
        setAfspraken(prev => prev.filter(afspraak => 
          afspraak.id !== afspraakId && afspraak.afspraak_id !== afspraakId
        ));
        setDeleteStatus('Afspraak succesvol verwijderd');
        setTimeout(() => setDeleteStatus(''), 3000);
      } else {
        setDeleteStatus('Kon afspraak niet verwijderen');
        setTimeout(() => setDeleteStatus(''), 3000);
      }
    } catch (error) {
      console.error('Fout bij verwijderen afspraak:', error);
      setDeleteStatus('Er is een fout opgetreden');
      setTimeout(() => setDeleteStatus(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welkom, {CURRENT_USER}</h1>
        <p>Hier is jouw gepersonaliseerde Jobbeurs</p>
        {deleteStatus && <div className="status-message">{deleteStatus}</div>}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header"> 
            <h2>Deelnemende Bedrijven</h2>
            <Link to="/student/bedrijven" className="view-all">
              Bekijk alles →
            </Link>
          </div>
          <div className="bedrijven-list">
            {bedrijven.length > 0 ? (
              bedrijven.map((bedrijf, index) => (
                <div key={`bedrijf-${bedrijf.bedrijf_id || index}`} className="bedrijf-item">
                  <span>{bedrijf.naam}</span>
                  <span className="bedrijf-sector">{bedrijf.sector}</span>
                </div>
              ))
            ) : (
              <p>Laden van bedrijven...</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Komende Afspraken</h2>
            <Link to="/student/afspraken" className="view-all">
              Bekijk alles →
            </Link>
          </div>
          <div className="afspraken-list reverse-list">
            {afspraken.length > 0 ? (
              afspraken.map((afspraak, index) => {
                const afspraakId = afspraak.id || afspraak.afspraak_id;
                
                return (
                  <div key={`afspraak-${afspraakId || index}`} className="afspraak-item">
                    <div className="afspraak-info">
                      <span className="afspraak-bedrijf">{afspraak.bedrijf_naam || afspraak.bedrijfsnaam || "Onbekend bedrijf"}</span>
                      <span className="afspraak-tijd">
                        {afspraak.tijdslot || formateerTijdslot(afspraak.datum_tijd)}
                      </span>
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => verwijderAfspraak(afspraakId)}
                      disabled={isDeleting}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="geen-afspraken">
                Je hebt nog geen afspraken gepland.
                <Link to="/student/afsprakenmodule" className="maak-afspraak">
                  Plan een afspraak
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;