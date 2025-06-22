import React, { useState, useEffect } from 'react';
import './AdminBedrijf.css';
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../../config';

function AdminBedrijf() {
  const [bedrijven, setBedrijven] = useState([]);
  const [sectoren, setSectoren] = useState([]);
  const [filter, setFilter] = useState('');
  const [toonBewerken, setToonBewerken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  const haalSectorenOp = async () => {
    try {
      console.log('Fetching sectoren from:', `${baseUrl}/sectoren`);
      const response = await fetch(`${baseUrl}/sectoren`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Sectoren opgehaald:', data);
      setSectoren(data);

    } catch (error) {
      console.error('Fout bij ophalen sectoren:', error.message);
      // Set fallback sectoren if API fails
      const fallbackSectoren = [
        { sector_id: 1, naam: 'IT & Software' },
        { sector_id: 2, naam: 'Engineering' },
        { sector_id: 3, naam: 'Finance' },
        { sector_id: 4, naam: 'Healthcare' },
        { sector_id: 5, naam: 'Education' },
        { sector_id: 6, naam: 'Marketing' },
        { sector_id: 7, naam: 'Sales' }
      ];
      console.log('Using fallback sectoren:', fallbackSectoren);
      setSectoren(fallbackSectoren);
    }
  };

  useEffect(() => {
    haalBedrijvenOp();
    haalSectorenOp();
  }, []);

  const handleFormulierVerzenden = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const isNieuw = !bewerkFormulier.bedrijf_id;

    try {
      console.log('Sending company data:', bewerkFormulier);

      const response = await fetch(`${baseUrl}/bedrijvenmodule${isNieuw ? '' : `/${bewerkFormulier.bedrijf_id}`}`, {
        method: isNieuw ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bewerkFormulier)
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Fout bij opslaan bedrijf');
      }

      setMessage(`✅ Bedrijf ${isNieuw ? 'toegevoegd' : 'bijgewerkt'} succesvol!`);
      await haalBedrijvenOp();
      resetFormulier();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Fout bij opslaan bedrijf:', error);
      setMessage(`❌ Fout bij opslaan: ${error.message}`);
    } finally {
      setLoading(false);
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

  const opslaanBedrijf = async (bedrijf) => {
    setLoading(true);
    setMessage('');

    try {
      console.log('Saving company:', bedrijf);

      const response = await fetch(`${baseUrl}/bedrijvenmodule/${bedrijf.bedrijf_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bedrijf)
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Fout bij opslaan bedrijf');
      }

      setMessage(`✅ Bedrijf ${bedrijf.naam} succesvol opgeslagen!`);
      await haalBedrijvenOp(); // Refresh the list

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Fout bij opslaan bedrijf:', error);
      setMessage(`❌ Fout bij opslaan: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="bedrijven-header">
            <input
              type="text"
              placeholder="Filter op naam..."
              className="filter-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className="bewerken-button"
              onClick={() => setToonBewerken(!toonBewerken)}
              disabled={loading}
            >
              {toonBewerken ? 'Stoppen met bewerken' : 'Bewerken'}
            </button>
          </div>

          <div className="bedrijven-grid">
            {bedrijven
              .filter((bedrijf) => bedrijf.naam?.toLowerCase().includes(filter.toLowerCase()))
              .map((bedrijf) => (
                <div key={bedrijf.bedrijf_id} className={`bedrijf-card ${toonBewerken ? 'editable' : ''}`}>
                  <div className="bedrijf-image">
                    {bedrijf.logo_url ? (
                      <img src={bedrijf.logo_url} alt={`${bedrijf.naam} logo`} />
                    ) : (
                      <div className="bedrijf-logo-placeholder"></div>
                    )}
                  </div>

                  {toonBewerken ? (
                    <div className="editable-fields">
                      <input
                        type="text"
                        value={bedrijf.naam || ''}
                        onChange={(e) => {
                          const updatedBedrijven = bedrijven.map(b =>
                            b.bedrijf_id === bedrijf.bedrijf_id
                              ? { ...b, naam: e.target.value }
                              : b
                          );
                          setBedrijven(updatedBedrijven);
                        }}
                        placeholder="Bedrijfsnaam"
                        className="edit-input"
                      />
                      <select
                        value={bedrijf.sector || ''}
                        onChange={(e) => {
                          const updatedBedrijven = bedrijven.map(b =>
                            b.bedrijf_id === bedrijf.bedrijf_id
                              ? { ...b, sector: e.target.value }
                              : b
                          );
                          setBedrijven(updatedBedrijven);
                        }}
                        className="edit-input"
                      >
                        <option value="">Selecteer sector...</option>
                        {sectoren.map(sector => (
                          <option key={sector.sector_id} value={sector.naam}>
                            {sector.naam}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={bedrijf.gemeente || ''}
                        onChange={(e) => {
                          const updatedBedrijven = bedrijven.map(b =>
                            b.bedrijf_id === bedrijf.bedrijf_id
                              ? { ...b, gemeente: e.target.value }
                              : b
                          );
                          setBedrijven(updatedBedrijven);
                        }}
                        placeholder="Gemeente"
                        className="edit-input"
                      />
                      <button
                        className="save-individual-button"
                        onClick={() => opslaanBedrijf(bedrijf)}
                        disabled={loading}
                      >
                        {loading ? 'Bezig...' : 'Opslaan'}
                      </button>
                    </div>
                  ) : (
                    <div className="bedrijf-info">
                      <strong>{bedrijf.naam}</strong>
                      <p>{bedrijf.sector}</p>
                      <p>{bedrijf.gemeente}</p>
                    </div>
                  )}

                  <button className="verwijder-button" onClick={() => verwijderBedrijf(bedrijf.bedrijf_id)}>
                    Verwijderen
                  </button>
                </div>
              ))}
          </div>


        </section>
      </main>
    </div>
  );
}

export default AdminBedrijf;