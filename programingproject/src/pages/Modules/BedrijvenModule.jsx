import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTimes, FaGraduationCap, FaGlobe, FaEnvelope, FaPhone, FaLink, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider";
import "./BedrijvenModule.css";
import { baseUrl } from "../../config";

export default function Bedrijven() {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [filteredBedrijven, setFilteredBedrijven] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [expandedBedrijf, setExpandedBedrijf] = useState(null);
  
  const [naamFilter, setNaamFilter] = useState("");
  const [studierichtingFilter, setStudierichtingFilter] = useState("");
  const [aanbiedingenFilter, setAanbiedingenFilter] = useState("");
  const [speeddateFilter, setSpeedDateFilter] = useState("");
  
  const [studierichtingen, setStudierichtingen] = useState([]);
  const [aanbiedingenOpties, setAanbiedingenOpties] = useState([]);

  const splitStudierichtingen = (opleidingenString) => {
    if (!opleidingenString) return [];
    return opleidingenString.split(',').map(richting => richting.trim()).filter(r => r);
  };

  const splitAanbiedingen = (aanbiedingenString) => {
    if (!aanbiedingenString || aanbiedingenString === 'undefined') return [];
    return aanbiedingenString.split(',').map(aanbieding => aanbieding.trim()).filter(a => a);
  };

  useEffect(() => {
    async function haalBedrijvenOp() {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!res.ok) throw new Error("Kon bedrijven niet ophalen");
        
        const data = await res.json();
        
        setBedrijven(data);
        setFilteredBedrijven(data);
        
        let alleStudierichtingen = [];
        data.forEach(bedrijf => {
          if (bedrijf.doelgroep_opleiding) {
            const gesplitsteRichtingen = splitStudierichtingen(bedrijf.doelgroep_opleiding);
            alleStudierichtingen = [...alleStudierichtingen, ...gesplitsteRichtingen];
          }
        });
        
        let alleAanbiedingen = [];
        data.forEach(bedrijf => {
          if (bedrijf.aanbiedingen && bedrijf.aanbiedingen !== 'undefined') {
            const gesplitsteAanbiedingen = splitAanbiedingen(bedrijf.aanbiedingen);
            alleAanbiedingen = [...alleAanbiedingen, ...gesplitsteAanbiedingen];
          }
        });
        
        const uniqueOpleidingen = [...new Set(alleStudierichtingen)];
        setStudierichtingen(uniqueOpleidingen.length > 0 ? uniqueOpleidingen : [
          "Informatica", "Business IT", "Software Engineering", "Cyber Security", 
          "Data Science", "Artificial Intelligence", "Elektrotechniek", "Werktuigbouwkunde"
        ]);
        
        const uniqueAanbiedingen = [...new Set(alleAanbiedingen)];
        setAanbiedingenOpties(uniqueAanbiedingen.length > 0 ? uniqueAanbiedingen : [
          "Stage(s)", "Bachelorproef", "Job(s)", "Studentenjob(s)"
        ]);
      } catch (err) {
        console.error("Fout bij ophalen bedrijven:", err);
        setError("Er is een probleem opgetreden bij het ophalen van de bedrijven.");
      } finally {
        setLoading(false);
      }
    }

    haalBedrijvenOp();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      setIsFiltering(true);
      let filtered = [...bedrijven];
      
      if (naamFilter.trim()) {
        filtered = filtered.filter(bedrijf => 
          bedrijf.naam && bedrijf.naam.toLowerCase().includes(naamFilter.toLowerCase())
        );
      }
      
      if (studierichtingFilter) {
        filtered = filtered.filter(bedrijf => {
          if (!bedrijf.doelgroep_opleiding) return false;
          
          const bedrijfRichtingen = splitStudierichtingen(bedrijf.doelgroep_opleiding);
          
          return bedrijfRichtingen.some(richting => 
            richting.toLowerCase() === studierichtingFilter.toLowerCase()
          );
        });
      }
      
      if (aanbiedingenFilter) {
        filtered = filtered.filter(bedrijf => {
          if (!bedrijf.aanbiedingen || bedrijf.aanbiedingen === 'undefined') return false;
          
          const bedrijfAanbiedingen = splitAanbiedingen(bedrijf.aanbiedingen);
          
          return bedrijfAanbiedingen.some(aanbieding => 
            aanbieding.toLowerCase().includes(aanbiedingenFilter.toLowerCase())
          );
        });
      }
      
      if (speeddateFilter !== "") {
        filtered = filtered.filter(bedrijf => {
          const doetSpeeddate = bedrijf.speeddates === 1;
          return speeddateFilter === "ja" ? doetSpeeddate : !doetSpeeddate;
        });
      }
      
      setFilteredBedrijven(filtered);
      setIsFiltering(false);
    };
    
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [naamFilter, studierichtingFilter, aanbiedingenFilter, speeddateFilter, bedrijven]);

  const resetFilters = () => {
    setNaamFilter("");
    setStudierichtingFilter("");
    setAanbiedingenFilter("");
    setSpeedDateFilter("");
  };

  const toggleBedrijfDetails = (bedrijfId) => {
    setExpandedBedrijf(expandedBedrijf === bedrijfId ? null : bedrijfId);
  };

  const getBedrijfStudierichtingen = (bedrijf) => {
    if (!bedrijf.doelgroep_opleiding) return [];
    return splitStudierichtingen(bedrijf.doelgroep_opleiding);
  };

  const getBedrijfAanbiedingen = (bedrijf) => {
    if (!bedrijf.aanbiedingen || bedrijf.aanbiedingen === 'undefined') return [];
    return splitAanbiedingen(bedrijf.aanbiedingen);
  };

  const formateerWebsiteUrl = (url) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="page-container bedrijven-module">
      <h2 className="module-title">Deelnemende Bedrijven</h2>
      <p className="module-subtext">
        Hier vind je een overzicht van alle bedrijven die deelnemen aan de CareerLaunch
      </p>

      <div className="filter-toolbar">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="filter-toggle-btn"
        >
          {showFilters ? <FaTimes /> : <FaFilter />}
          <span>{showFilters ? 'Verberg filters' : 'Toon filters'}</span>
        </button>
        
        {filteredBedrijven.length > 0 && (
          <span className="resultaten-aantal">
            {filteredBedrijven.length} {filteredBedrijven.length === 1 ? 'bedrijf' : 'bedrijven'} gevonden
          </span>
        )}
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <div className="filter-group">
              <div className="filter-icon"><FaSearch /></div>
              <input
                type="text"
                placeholder="Zoek op bedrijfsnaam..."
                value={naamFilter}
                onChange={(e) => setNaamFilter(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-icon"><FaGraduationCap /></div>
              <select 
                value={studierichtingFilter}
                onChange={(e) => setStudierichtingFilter(e.target.value)}
                className="studierichting-select"
              >
                <option value="">Alle studierichtingen</option>
                {studierichtingen.map((richting, index) => (
                  <option key={index} value={richting}>{richting}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select 
                value={aanbiedingenFilter}
                onChange={(e) => setAanbiedingenFilter(e.target.value)}
                className="aanbiedingen-select"
              >
                <option value="">Alle aanbiedingen</option>
                {aanbiedingenOpties.map((aanbieding, index) => (
                  <option key={index} value={aanbieding}>{aanbieding}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select 
                value={speeddateFilter}
                onChange={(e) => setSpeedDateFilter(e.target.value)}
                className="speeddate-select"
              >
                <option value="">Speeddate (alle)</option>
                <option value="ja">Doet speeddate</option>
                <option value="nee">Geen speeddate</option>
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="reset-btn"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Bedrijven laden...</p>
        </div>
      ) : isFiltering ? (
        <div className="loading-container">
          <p>Filters toepassen...</p>
        </div>
      ) : filteredBedrijven.length > 0 ? (
        <div className="bedrijven-container">
          <div className="bedrijven-grid">
            {filteredBedrijven.map((bedrijf) => (
              <React.Fragment key={bedrijf.bedrijf_id}>
                <div className="bedrijf-card">
                  <div className="bedrijf-card-header">
                    <div className="bedrijf-logo">
                      {bedrijf.logo_url ? (
                        <img src={bedrijf.logo_url} alt={`${bedrijf.naam} logo`} />
                      ) : (
                        <div className="placeholder-logo">{bedrijf.naam.charAt(0)}</div>
                      )}
                    </div>
                    <h3 className="bedrijf-naam">{bedrijf.naam}</h3>
                    <div className="bedrijf-tags">
                      {bedrijf.speeddates === 1 && <span className="bedrijf-tag speeddate-tag">Speeddate</span>}
                    </div>
                  </div>
                  
                  <div className="bedrijf-card-body">
                    <p className="bedrijf-beschrijving">
                      {bedrijf.beschrijving ? 
                        (bedrijf.beschrijving.length > 120 ? 
                          bedrijf.beschrijving.substring(0, 120) + '...' : 
                          bedrijf.beschrijving) : 
                        "Geen beschrijving beschikbaar"
                      }
                    </p>
                    
                    <div className="bedrijf-quick-info">
                      {getBedrijfAanbiedingen(bedrijf).length > 0 && (
                        <div className="quick-info-item">
                          <strong>Aanbiedingen:</strong>
                          <div className="quick-info-tags">
                            {getBedrijfAanbiedingen(bedrijf).map((aanbieding, index) => (
                              <span key={index} className="info-tag aanbieding-tag">{aanbieding}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {bedrijf.doelgroep_opleiding && (
                        <div className="quick-info-item">
                          <strong>Studierichtingen:</strong>
                          <div className="quick-info-tags">
                            {getBedrijfStudierichtingen(bedrijf).slice(0, 2).map((richting, index) => (
                              <span key={index} className="info-tag studierichting-tag">{richting}</span>
                            ))}
                            {getBedrijfStudierichtingen(bedrijf).length > 2 && (
                              <span className="info-tag more-tag">+{getBedrijfStudierichtingen(bedrijf).length - 2} meer</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bedrijf-card-footer">
                    <button 
                      className="details-toggle-btn" 
                      onClick={() => toggleBedrijfDetails(bedrijf.bedrijf_id)}
                      aria-expanded={expandedBedrijf === bedrijf.bedrijf_id}
                    >
                      {expandedBedrijf === bedrijf.bedrijf_id ? "Minder info" : "Meer info"}
                      {expandedBedrijf === bedrijf.bedrijf_id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>
                
                {expandedBedrijf === bedrijf.bedrijf_id && (
                  <div className="bedrijf-details-wrapper">
                    <div className="bedrijf-details-panel">
                      {bedrijf.beschrijving && (
                        <div className="details-section">
                          <h4>Over ons</h4>
                          <p>{bedrijf.beschrijving}</p>
                        </div>
                      )}
                      
                      {bedrijf.specialisatie && (
                        <div className="details-section">
                          <h4>Specialisatie</h4>
                          <p>{bedrijf.specialisatie}</p>
                        </div>
                      )}
                      
                      {(bedrijf.website_of_LinkedIn || bedrijf.website) && (
                        <div className="details-section">
                          <h4>Online</h4>
                          <div className="links-grid">
                            {bedrijf.website_of_LinkedIn && (
                              <div className="link-item">
                                <a 
                                  href={formateerWebsiteUrl(bedrijf.website_of_LinkedIn)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="website-link"
                                >
                                  <FaGlobe className="link-icon" />
                                  Website/LinkedIn
                                </a>
                              </div>
                            )}
                            
                            {bedrijf.website && bedrijf.website !== bedrijf.website_of_LinkedIn && (
                              <div className="link-item">
                                <a 
                                  href={formateerWebsiteUrl(bedrijf.website)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="website-link"
                                >
                                  <FaLink className="link-icon" />
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="details-section">
                        <h4>Contact Informatie</h4>
                        <div className="contact-items">
                          {bedrijf.contactpersoon && (
                            <div className="contact-item">
                              <strong>Contactpersoon</strong>
                              <span>{bedrijf.contactpersoon}</span>
                            </div>
                          )}
                          
                          {bedrijf.email && (
                            <div className="contact-item">
                              <strong>Email</strong>
                              <a href={`mailto:${bedrijf.email}`}>
                                <FaEnvelope className="contact-icon" />
                                {bedrijf.email}
                              </a>
                            </div>
                          )}
                          
                          {bedrijf.telefoonnummer && (
                            <div className="contact-item">
                              <strong>Telefoon</strong>
                              <a href={`tel:${bedrijf.telefoonnummer}`}>
                                <FaPhone className="contact-icon" />
                                {bedrijf.telefoonnummer}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="details-section">
                        <h4>Wij zoeken</h4>
                        <div className="vacancy-info">
                          {getBedrijfAanbiedingen(bedrijf).length > 0 && (
                            <div className="vacancy-item">
                              <h5>Aanbiedingen:</h5>
                              <ul>
                                {getBedrijfAanbiedingen(bedrijf).map((aanbieding, index) => (
                                  <li key={index}>{aanbieding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {bedrijf.doelgroep_opleiding && (
                            <div className="vacancy-item">
                              <h5>Studierichtingen:</h5>
                              <ul>
                                {getBedrijfStudierichtingen(bedrijf).map((richting, index) => (
                                  <li key={index}>{richting}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="vacancy-item">
                            <h5>Speeddate:</h5>
                            <p>{bedrijf.speeddates === 1 ? "Ja" : "Nee"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="geen-resultaten">
          <p>Geen bedrijven gevonden met de huidige filters</p>
          <button 
            onClick={resetFilters} 
            className="reset-filters-btn"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}