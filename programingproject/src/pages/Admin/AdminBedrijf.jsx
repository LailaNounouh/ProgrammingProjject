import React, { useState, useEffect } from 'react';
import './AdminBedrijf.css';
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../../config';

function AdminBedrijf() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filter, setFilter] = useState('');
  const [toonBewerken, setToonBewerken] = useState(false);
  const [bewerkFormulier, setBewerkFormulier] = useState({
    bedrijf_id: '',
    naam: '',
    straat: '',
    nummer: '',
    postcode: '',
    gemeente: '',
    telefoonnummer: '',
    email: '',
    btw_nummer: '',
    contactpersoon_facturatie: '',
    email_facturatie: '',
    po_nummer: '',
    contactpersoon_beurs: '',
    email_beurs: '',
    website_of_linkedin: '',
    logo_url: '',
    staat_van_betaling: '',
    standselectie: '',
    opleidingsmatch: '',
    beschikbare_tijdsloten: '',
    speeddates: false,
    aanbiedingen: '',
    doelgroep_opleiding: '',
    sector: '',
    wachtwoord: ''
  });

  const navigate = useNavigate();

  const haalBedrijvenOp = async () => {
    try {
      const response = await fetch(`${baseUrl}/bedrijvenmodule`);
      if (!response.ok) throw new Error('Netwerkfout');
      const data = await response.json();
      setBedrijven(data);
    } catch (error) {
      console.error('Fout bij ophalen bedrijven:', error);
    }
  };

  useEffect(() => {
    haalBedrijvenOp();
  }, []);

  const handleFormulierVerzenden = async (e) => {
    e.preventDefault();
    const isNieuw = !bewerkFormulier.bedrijf_id;

    const formData = new FormData();
    
    Object.keys(bewerkFormulier).forEach(key => {
      if (key === 'speeddates') {
        formData.append(key, bewerkFormulier[key] ? 1 : 0);
      } else if (bewerkFormulier[key] !== null) {
        formData.append(key, bewerkFormulier[key]);
      }
    });

    try {
      const response = await fetch(`${baseUrl}/bedrijvenmodule${isNieuw ? '' : `/${bewerkFormulier.bedrijf_id}`}`, {
        method: isNieuw ? 'POST' : 'PUT',
        body: formData
      });

      if (!response.ok) {
        const foutBericht = await response.text();
        throw new Error(foutBericht);
      }

      await haalBedrijvenOp();
      resetFormulier();
    } catch (error) {
      console.error('Fout:', error.message);
      alert(error.message);
    }
  };

  const verwijderBedrijf = async (id) => {
    if (!window.confirm('Weet je zeker dat je dit bedrijf wilt verwijderen?')) return;

    try {
      const response = await fetch(`${baseUrl}/bedrijvenmodule/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const foutBericht = await response.text();
        throw new Error(foutBericht);
      }
      await haalBedrijvenOp();
    } catch (error) {
      console.error('Fout:', error.message);
      alert(error.message);
    }
  };

  const startBewerken = (bedrijf) => {
    setBewerkFormulier({
      ...bewerkFormulier,
      ...bedrijf,
      speeddates: !!bedrijf.speeddates
    });
    setToonBewerken(true);
  };

  const resetFormulier = () => {
    setBewerkFormulier({
      bedrijf_id: '',
      naam: '',
      straat: '',
      nummer: '',
      postcode: '',
      gemeente: '',
      telefoonnummer: '',
      email: '',
      btw_nummer: '',
      contactpersoon_facturatie: '',
      email_facturatie: '',
      po_nummer: '',
      contactpersoon_beurs: '',
      email_beurs: '',
      website_of_linkedin: '',
      logo_url: '',
      staat_van_betaling: '',
      standselectie: '',
      opleidingsmatch: '',
      beschikbare_tijdsloten: '',
      speeddates: false,
      aanbiedingen: '',
      doelgroep_opleiding: '',
      sector: '',
      wachtwoord: ''
    });
    setToonBewerken(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate("/admin")}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="bedrijven-section">
          <h2>Deelnemende bedrijven</h2>

          <div className="bedrijven-header">
            <input
              type="text"
              placeholder="Filter op naam..."
              className="filter-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className="bewerken-button" onClick={() => setToonBewerken(!toonBewerken)}>
              {toonBewerken ? 'Opslaan' : 'Bewerken'}
            </button>
          </div>

          {!toonBewerken ? (
            <div className="bedrijven-grid">
              {bedrijven
                .filter((bedrijf) => bedrijf.naam?.toLowerCase().includes(filter.toLowerCase()))
                .map((bedrijf) => (
                  <div key={bedrijf.bedrijf_id} className="bedrijf-card">
                    <div className="bedrijf-image">
                      {bedrijf.logo_url ? (
                        <img src={bedrijf.logo_url} alt={`${bedrijf.naam} logo`} />
                      ) : (
                        <div className="bedrijf-logo-placeholder"></div>
                      )}
                    </div>
                    <strong>{bedrijf.naam}</strong>
                    <p>{bedrijf.sector}</p>
                    <p>{bedrijf.gemeente}</p>
                    <button onClick={() => startBewerken(bedrijf)}>Bewerken</button>
                    <button className="verwijder-button" onClick={() => verwijderBedrijf(bedrijf.bedrijf_id)}>
                      Verwijderen
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <form onSubmit={handleFormulierVerzenden}>
              {Object.keys(bewerkFormulier).map(key => {
                if (key === 'bedrijf_id') return null;
                
                if (key === 'speeddates') {
                  return (
                    <div key={key} className="form-group">
                      <label>{key}:</label>
                      <input
                        type="checkbox"
                        checked={bewerkFormulier[key]}
                        onChange={(e) => setBewerkFormulier({
                          ...bewerkFormulier,
                          [key]: e.target.checked
                        })}
                      />
                    </div>
                  );
                }

                return (
                  <div key={key} className="form-group">
                    <label>{key}:</label>
                    <input
                      type={key.includes('email') ? 'email' : 
                            key.includes('website') || key.includes('logo') ? 'url' : 
                            key.includes('telefoon') ? 'tel' :
                            key === 'wachtwoord' ? 'password' : 'text'}
                      value={bewerkFormulier[key] || ''}
                      onChange={(e) => setBewerkFormulier({
                        ...bewerkFormulier,
                        [key]: e.target.value
                      })}
                      required={key === 'naam'}
                    />
                  </div>
                );
              })}

              <div className="form-buttons">
                <button type="submit">
                  {bewerkFormulier.bedrijf_id ? 'Wijzigingen Opslaan' : 'Bedrijf Toevoegen'}
                </button>
                <button type="button" onClick={resetFormulier}>
                  Annuleren
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminBedrijf;