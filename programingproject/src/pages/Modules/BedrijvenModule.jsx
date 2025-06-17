import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";
import "./BedrijvenModule.css";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const [selectedBedrijf, setSelectedBedrijf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const fetchBedrijven = async () => {
      try {
        const response = await fetch("http://10.2.160.211:3000/api/bedrijvenmodule");
        if (response.ok) {
          const data = await response.json();
          setBedrijven(data);
          // Extract unique sectors
          const uniqueSectors = [...new Set(data.map(bedrijf => bedrijf.sector))];
          setSectors(uniqueSectors);
        }
      } catch (error) {
        console.error("Fout bij ophalen bedrijven:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBedrijven();
  }, []);

  const handleShowDetails = (bedrijf) => {
    setSelectedBedrijf(bedrijf);
  };

  const filteredBedrijven = filter 
    ? bedrijven.filter(bedrijf => bedrijf.sector === filter)
    : bedrijven;

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="bedrijven-container">
      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="sector-filter"
        >
          <option value="">Alle sectoren</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="bedrijven-list">
        {filteredBedrijven.map((bedrijf) => (
          <div key={bedrijf.id} className="bedrijf-item">
            <div className="bedrijf-preview">
              <div className="bedrijf-header">
                <div className="bedrijf-info">
                  <h3>{bedrijf.naam}</h3>
                  <span className="sector">{bedrijf.sector}</span>
                </div>
              </div>
              <div className="bedrijf-preview-info">
                <p><strong>Locatie:</strong> {bedrijf.locatie}</p>
                <p><strong>Aantal vacatures:</strong> {bedrijf.vacatures?.length || 0}</p>
              </div>
              <button 
                className="meer-info-btn"
                onClick={() => handleShowDetails(bedrijf)}
              >
                Meer info
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedBedrijf && (
        <div className="bedrijf-detail-overlay">
          <div className="bedrijf-detail-card">
            <button className="close-btn" onClick={() => setSelectedBedrijf(null)}>&times;</button>
            <h2>{selectedBedrijf.naam}</h2>
            <div className="detail-content">
              <div className="detail-section">
                <h3>Over ons</h3>
                <p>{selectedBedrijf.beschrijving}</p>
              </div>
              <div className="detail-section">
                <h3>Contact</h3>
                <p>Email: {selectedBedrijf.email}</p>
                <p>Telefoon: {selectedBedrijf.telefoon}</p>
                <p>Locatie: {selectedBedrijf.locatie}</p>
              </div>
              <div className="detail-section">
                <h3>Vacatures</h3>
                <ul>
                  {selectedBedrijf.vacatures?.map((vacature, index) => (
                    <li key={index}>{vacature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
