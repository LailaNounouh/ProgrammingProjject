import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './StudentenDashboard.css';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const StudentDashboard = () => {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [filteredBedrijven, setFilteredBedrijven] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [error, setError] = useState('');
  const [loadingBedrijven, setLoadingBedrijven] = useState(true);
  const [loadingAfspraken, setLoadingAfspraken] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [bedrijfsNaamFilter, setBedrijfsNaamFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [locatieFilter, setLocatieFilter] = useState('');
  const [beschikbaarheidFilter, setBeschikbaarheidFilter] = useState('');
  const [sectors, setSectors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  useEffect(() => {
    const fetchBedrijven = async () => {
      setLoadingBedrijven(true);
      setError('');
      try {
        const response = await fetch('http://10.2.160.211:3000/api/bedrijvenmodule');
        if (response.ok) {
          const data = await response.json();
          setBedrijven(data);
          setFilteredBedrijven(data.slice(0, 5));
          
          const uniqueSectors = [...new Set(data.map(bedrijf => bedrijf.sector).filter(Boolean))];
          setSectors(uniqueSectors);
          
          const uniqueLocations = [...new Set(data.map(bedrijf => bedrijf.locatie).filter(Boolean))];
          setLocations(uniqueLocations);
        } else {
          setError('Fout bij ophalen bedrijven');
        }
      } catch (error) {
        console.error('Fout bij ophalen bedrijven:', error);
        setError('Kon geen verbinding maken met de server');
      } finally {
        setLoadingBedrijven(false);
      }
    };

    const fetchAfspraken = async () => {
      if (!gebruiker?.id) return; 
      
      setLoadingAfspraken(true);
      try {
        const response = await fetch(`http://10.2.160.211:3000/api/afspraken/student/${gebruiker.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setAfspraken(data);
        } else {
          console.error('Fout bij ophalen afspraken:', await response.text());
        }
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
        setError('Fout bij ophalen afspraken');
      } finally {
        setLoadingAfspraken(false);
      }
    };

    fetchBedrijven();
    if (gebruiker?.id) {
      fetchAfspraken();
    }
  }, [gebruiker]);
  
  useEffect(() => {
    const applyFilters = async () => {
      setIsFiltering(true);
      let filtered = [...bedrijven];
      
      if (bedrijfsNaamFilter.trim()) {
        filtered = filtered.filter(bedrijf => 
          bedrijf.naam && bedrijf.naam.toLowerCase().includes(bedrijfsNaamFilter.toLowerCase())
        );
      }
      
      if (sectorFilter) {
        filtered = filtered.filter(bedrijf => bedrijf.sector === sectorFilter);
      }
      
      if (locatieFilter) {
        filtered = filtered.filter(bedrijf => bedrijf.locatie === locatieFilter);
      }
      
      if (beschikbaarheidFilter === 'true') {
        filtered = filtered.filter(bedrijf => bedrijf.beschikbaar === true);
      } else if (beschikbaarheidFilter === 'false') {
        filtered = filtered.filter(bedrijf => bedrijf.beschikbaar === false);
      }
      
      setFilteredBedrijven(filtered.slice(0, 5));
      setIsFiltering(false);
    };
    
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [bedrijfsNaamFilter, sectorFilter, locatieFilter, beschikbaarheidFilter, bedrijven]);

  const resetFilters = () => {
    setBedrijfsNaamFilter('');
    setSectorFilter('');
    setLocatieFilter('');
    setBeschikbaarheidFilter('');
  };

  const filterKomendeAfspraken = (afspraken) => {
    if (!afspraken || afspraken.length === 0) return [];
    return afspraken;
  };

  const verwijderAfspraak = async (afspraakId) => {
    if (!window.confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteStatus('');
    
    try {
      const response = await fetch(`http://10.2.160.211:3000/api/afspraken/${afspraakId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setAfspraken(afspraken.filter(afspraak => afspraak.afspraak_id !== afspraakId));
        setDeleteStatus('Afspraak succesvol verwijderd');
        
        setTimeout(() => {
          setDeleteStatus('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setDeleteStatus(`Fout bij verwijderen: ${errorData.message || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Fout bij verwijderen afspraak:', error);
      setDeleteStatus('Fout bij verbinding met de server');
    } finally {
      setIsDeleting(false);
    }
  };

  const formateerDatum = (datumString) => {
    if (!datumString) return '';
    
    return '13-03-2026';
  };

  const komendeAfspraken = afspraken.length > 0 ? filterKomendeAfspraken(afspraken) : [];

  return (
    <div className="dashboard-container">
      {error && <div className="error-message">{error}</div>}
      {deleteStatus && <div className="status-message">{deleteStatus}</div>}

      <div className="welcome-section">
        <h1>Welkom{gebruiker ? `, ${gebruiker.naam}` : ' op het dashboard'}</h1>
        <p>Hier is een overzicht van de CareerLaunch</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Deelnemende Bedrijven</h2>
            <div className="header-actions">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="filter-toggle-btn"
                aria-label={showFilters ? "Verberg filters" : "Toon filters"}
              >
                {showFilters ? <FaTimes /> : <FaFilter />}
                <span>{showFilters ? 'Verberg filters' : 'Filters'}</span>
              </button>
              <Link to="/student/bedrijven" className="view-all">
                Bekijk alles →
              </Link>
            </div>
          </div>
          
          {showFilters && (
            <div className="filter-controls">
              <div className="filter-row">
                <div className="filter-group">
                  <div className="filter-icon"><FaSearch /></div>
                  <input
                    type="text"
                    placeholder="Zoek op bedrijfsnaam..."
                    value={bedrijfsNaamFilter}
                    onChange={(e) => setBedrijfsNaamFilter(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="filter-group">
                  <div className="filter-icon"><FaBuilding /></div>
                  <select 
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="sector-select"
                  >
                    <option value="">Alle sectoren</option>
                    {sectors.map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <div className="filter-icon"><FaMapMarkerAlt /></div>
                  <select 
                    value={locatieFilter}
                    onChange={(e) => setLocatieFilter(e.target.value)}
                    className="locatie-select"
                  >
                    <option value="">Alle locaties</option>
                    {locations.map((locatie, index) => (
                      <option key={index} value={locatie}>{locatie}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <div className="filter-icon"><FaCalendarAlt /></div>
                  <select 
                    value={beschikbaarheidFilter}
                    onChange={(e) => setBeschikbaarheidFilter(e.target.value)}
                    className="beschikbaarheid-select"
                  >
                    <option value="">Alle beschikbaarheden</option>
                    <option value="true">Beschikbaar</option>
                    <option value="false">Niet beschikbaar</option>
                  </select>
                </div>
                
                <button 
                  onClick={resetFilters}
                  className="reset-btn"
                  aria-label="Reset filters"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          
          <div className="bedrijven-list">
            {loadingBedrijven ? (
              <p>Bedrijven laden...</p>
            ) : isFiltering ? (
              <p>Filters toepassen...</p>
            ) : filteredBedrijven.length > 0 ? (
              filteredBedrijven.map((bedrijf, index) => (
                <div key={`bedrijf-${bedrijf.bedrijf_id || index}`} className="bedrijf-item">
                  <div className="bedrijf-info">
                    <span className="bedrijf-naam">{bedrijf.naam}</span>
                    <div className="bedrijf-details">
                      {bedrijf.sector && <span className="bedrijf-sector">{bedrijf.sector}</span>}
                      {bedrijf.locatie && <span className="bedrijf-locatie">{bedrijf.locatie}</span>}
                    </div>
                  </div>
                  <Link 
                    to={`/student/bedrijven/${bedrijf.bedrijf_id}`} 
                    className="view-bedrijf-btn"
                  >
                    Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-results">Geen bedrijven gevonden met deze filters</p>
            )}
          </div>
          
          {filteredBedrijven.length > 0 && filteredBedrijven.length < bedrijven.length && (
            <div className="results-count">
              Toont {filteredBedrijven.length} van {bedrijven.length} bedrijven
              {filteredBedrijven.length === 5 && bedrijven.length > 5 && (
                <Link to="/student/bedrijven" className="see-all-link"> Bekijk alle resultaten</Link>
              )}
            </div>
          )}
        </div>

        {gebruiker && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Komende Afspraken</h2>
              <Link to="/student/afspraken" className="view-all">
                Bekijk alles →
              </Link>
            </div>
            <div className="afspraken-list">
              {loadingAfspraken ? (
                <p>Afspraken laden...</p>
              ) : komendeAfspraken.length > 0 ? (
                komendeAfspraken.map((afspraak, index) => (
                  <div key={`afspraak-${afspraak.afspraak_id || index}`} className="afspraak-item">
                    <div className="afspraak-info">
                      <span className="afspraak-bedrijf">{afspraak.bedrijfsnaam}</span>
                      <span className="afspraak-tijd">
                        {formateerDatum(afspraak.datum)} {afspraak.tijdslot}
                      </span>
                    </div>
                    <button 
                      onClick={() => verwijderAfspraak(afspraak.afspraak_id)} 
                      className="delete-btn"
                      disabled={isDeleting}
                      aria-label="Verwijder afspraak"
                    >
                      x
                    </button>
                  </div>
                ))
              ) : (
                <p className="geen-afspraken">
                  Je hebt nog geen afspraken gepland.
                  <Link to="/student/afspraken" className="maak-afspraak">
                    Plan een afspraak
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;