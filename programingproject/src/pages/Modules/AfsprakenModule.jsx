import React, { useState, useEffect } from "react";
import "./AfsprakenModule.css";
import { baseUrl } from "../../config";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient"; // Voeg deze import toe
import { useAuth } from "../../context/AuthProvider"; // Voeg deze import toe

export default function Afspraken() {
  const [bedrijven, setBedrijven] = useState([]);
  const [alleBedrijven, setAlleBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [presetBedrijf, setPresetBedrijf] = useState(false);
  const [tijdslot, setTijdslot] = useState("");
  const [datum] = useState("2026-03-13");
  const [beschikbareTijdsloten, setBeschikbareTijdsloten] = useState([]);
  const [bezetteTijdsloten, setBezetteTijdsloten] = useState([]);
  const [alleTijdsloten, setAlleTijdsloten] = useState([]);
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);
  const [afspraakDetails, setAfspraakDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [socket, setSocket] = useState(null);
  const [afsprakenOverzicht, setAfsprakenOverzicht] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { gebruiker } = useAuth(); // Gebruik auth context

  // Lees queryparameter ?bedrijf=ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("bedrijf");
    if (q && !bedrijfId) {
      setBedrijfId(q);
      setPresetBedrijf(true);
    }
  }, [location.search, bedrijfId]);

  // Socket init
  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Afspraken van student - gebruik apiClient
  useEffect(() => {
    const fetchAfspraken = async () => {
      if (!gebruiker?.id) return;
      
      try {
        const data = await apiClient.get(`/afspraken/student/${gebruiker.id}?datum=2026-03-13`);
        if (Array.isArray(data)) {
          setAfsprakenOverzicht(data);
        }
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
      }
    };

    fetchAfspraken();
  }, [gebruiker]);

  // Socket room voor geselecteerd bedrijf
  useEffect(() => {
    if (!socket || !bedrijfId) return;
    socket.emit("joinAppointmentRoom", { bedrijfId, datum });
    socket.on("appointmentCreated", (data) => {
      if (String(data.bedrijf_id) === String(bedrijfId) && data.datum === datum) {
        setBezetteTijdsloten(p => [...p, data.tijdslot]);
        setBeschikbareTijdsloten(p => p.filter(t => t !== data.tijdslot));
      }
    });
    return () => {
      socket.emit("leaveAppointmentRoom", { bedrijfId, datum });
      socket.off("appointmentCreated");
    };
  }, [socket, bedrijfId, datum]);

  // Bedrijven laden EN FILTEREN OP SPEEDDATE - gebruik apiClient
  useEffect(() => {
    const fetchBedrijven = async () => {
      try {
        setLoading(true);
        console.log('🔵 Fetching bedrijven for afspraken module...');
        
        const allData = await apiClient.get('/bedrijvenmodule');
        console.log('📋 All bedrijven received:', allData?.length || 0);
        console.log('📋 Sample bedrijf data:', allData?.[0]);
        
        setAlleBedrijven(allData || []);
        
        // Filter alleen bedrijven die speeddate doen
        const speedDateBedrijven = (allData || []).filter(bedrijf => {
          const hasSpeedDate = bedrijf.speeddates === 1 || bedrijf.speeddate === 1 || bedrijf.speeddate === true;
          
          console.log(`🔍 Bedrijf ${bedrijf.naam}: speeddate=${bedrijf.speeddates}, speeddate alt=${bedrijf.speeddate}, included=${hasSpeedDate}`);
          
          return hasSpeedDate;
        });
        
        console.log('✅ Filtered speeddate bedrijven:', speedDateBedrijven.length);
        console.log('📋 Speeddate bedrijven:', speedDateBedrijven.map(b => ({
          id: b.bedrijf_id,
          naam: b.naam,
          speeddate: b.speeddates || b.speeddate
        })));
        
        setBedrijven(speedDateBedrijven);
        
        if (speedDateBedrijven.length === 0) {
          setError("Geen bedrijven beschikbaar voor speeddate afspraken.");
        }
        
      } catch (err) {
        console.error('🔴 Error fetching bedrijven:', err);
        setError("Probleem bij ophalen bedrijven.");
      } finally {
        setLoading(false);
      }
    };

    fetchBedrijven();
  }, []);

  // Controleer of preset bedrijf bestaat na laden EN of het speeddate doet
  useEffect(() => {
    if (presetBedrijf && bedrijfId && bedrijven.length) {
      const exists = bedrijven.some(b => String(b.bedrijf_id) === String(bedrijfId));
      if (!exists) {
        console.log(`⚠️ Preset bedrijf ${bedrijfId} does not exist or does not offer speeddate`);
        setError("Het geselecteerde bedrijf doet niet mee aan speeddate afspraken.");
        setPresetBedrijf(false);
        setBedrijfId("");
      }
    }
  }, [bedrijven, presetBedrijf, bedrijfId]);

  // Tijdsloten laden voor gekozen bedrijf - gebruik apiClient
  useEffect(() => {
    const fetchTijdsloten = async () => {
      if (!bedrijfId) return;
      
      try {
        setLoading(true);
        setError("");
        const data = await apiClient.get(`/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        setBeschikbareTijdsloten(data.beschikbaar || []);
        setBezetteTijdsloten(data.bezet || []);
        setAlleTijdsloten(data.alle || []);
        setTijdslot("");
      } catch (error) {
        console.error('Fout bij ophalen tijdsloten:', error);
        setError("Kon tijdsloten niet ophalen.");
      } finally {
        setLoading(false);
      }
    };

    fetchTijdsloten();
  }, [bedrijfId, datum, refreshTrigger]);

  // Submit handler - gebruik apiClient
  async function handleSubmit(e) {
    e.preventDefault();
    if (!bedrijfId || !tijdslot) {
      setError("Selecteer een bedrijf en tijdslot");
      return;
    }
    
    // Dubbel-check dat het bedrijf speeddate doet
    const selectedBedrijf = bedrijven.find(b => String(b.bedrijf_id) === String(bedrijfId));
    if (!selectedBedrijf) {
      setError("Geselecteerd bedrijf doet niet mee aan speeddate afspraken.");
      return;
    }
    
    if (!gebruiker?.id) {
      setError("Je moet ingelogd zijn om een afspraak te maken.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      console.log('🔵 Creating speeddate afspraak:', {
        student_id: gebruiker.id,
        bedrijf_id: bedrijfId,
        bedrijf_naam: selectedBedrijf.naam,
        tijdslot,
        datum
      });
      
      const response = await apiClient.post('/afspraken', {
        student_id: gebruiker.id,
        bedrijf_id: bedrijfId,
        tijdslot,
        datum
      });
      
      console.log('✅ Speeddate afspraak created successfully:', response);
      
      setAfspraakDetails({
        bedrijfNaam: selectedBedrijf?.naam || "Onbekend",
        tijdslot,
        datum,
        bedrijfId
      });
      setBezetteTijdsloten(p => [...p, tijdslot]);
      setBeschikbareTijdsloten(p => p.filter(t => t !== tijdslot));
      setAfspraakIngediend(true);
      setRefreshTrigger(p => p + 1);
    } catch (error) {
      console.error('🔴 Error creating speeddate afspraak:', error);
      setError(error.message || "Fout bij maken afspraak");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="afspraken-shell">
      <div className="afspraken-card">
        <h1 className="afspraken-title">
          <span className="spark">✦</span> Speeddate Afspraak maken
        </h1>
        
        <div className="speeddate-info">
          <p>Maak een afspraak voor een speeddate gesprek van 15 minuten met een bedrijf.</p>
          {bedrijven.length > 0 && (
            <p><strong>{bedrijven.length}</strong> bedrijven beschikbaar voor speeddate.</p>
          )}
        </div>

        {/* Debug info (verwijder in productie) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
            <strong>Debug Info:</strong><br/>
            Totaal bedrijven: {alleBedrijven.length}<br/>
            Speeddate bedrijven: {bedrijven.length}<br/>
            Gebruiker: {gebruiker?.naam} (ID: {gebruiker?.id})<br/>
            {alleBedrijven.slice(0, 3).map(b => (
              <div key={b.bedrijf_id}>
                {b.naam}: speeddates={b.speeddates}, speeddate={b.speeddate}
              </div>
            ))}
          </div>
        )}

        {afsprakenOverzicht.length > 0 && (
          <div className="afspraken-reeds">
            <p className="reeds-label">
              Je hebt al speeddate afspraken op <strong>13 maart 2026</strong> met:
            </p>
            <ul className="reeds-list">
              {afsprakenOverzicht.map((a, i) => (
                <li key={i} className="reeds-item">
                  <span className="reeds-bullet" />
                  <span className="reeds-bedrijf">{a.bedrijfsnaam}</span>
                  <span className="reeds-tijd">{a.tijdslot}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="afspraken-alert afspraken-alert--error">{error}</div>}
        {afspraakIngediend && afspraakDetails && (
          <div className="afspraken-alert afspraken-alert--ok">
            Speeddate afspraak bevestigd: {afspraakDetails.bedrijfNaam} – {afspraakDetails.tijdslot}
          </div>
        )}

        {!afspraakIngediend && bedrijven.length > 0 && (
          <form onSubmit={handleSubmit} className="afspraak-inline-form">
            <div className="field-row">
              {presetBedrijf && bedrijfId ? (
                <div className="vast-bedrijf-chip">
                  {bedrijven.find(b => String(b.bedrijf_id) === String(bedrijfId))?.naam || `#${bedrijfId}`}
                  <span className="speeddate-badge">Speeddate</span>
                  <button
                    type="button"
                    className="wissel-mini"
                    onClick={() => {
                      setPresetBedrijf(false);
                      setBedrijfId("");
                      setTijdslot("");
                      navigate("/student/afspraken", { replace: true });
                    }}
                    title="Wijzig bedrijf"
                  >
                    Wijzig
                  </button>
                </div>
              ) : (
                <select
                  value={bedrijfId}
                  onChange={e => { setBedrijfId(e.target.value); setTijdslot(""); }}
                  className="afspraak-select"
                  required
                >
                  <option value="">Kies een bedrijf voor speeddate</option>
                  {bedrijven.map(b => (
                    <option key={b.bedrijf_id} value={b.bedrijf_id}>
                      {b.naam} (Speeddate)
                    </option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                disabled={loading || !bedrijfId || !tijdslot}
                className="primary-btn"
              >
                {loading ? 'Bezig...' : 'Speeddate afspraak maken'}
              </button>
            </div>

            {bedrijfId && (
              <div className="slots-wrap">
                <div className="slots-header">
                  <span className="slots-label">Beschikbare speeddate tijdsloten (15 min)</span>
                  <div className="slots-legend">
                    <span><i className="dot dot--vrij" /> vrij</span>
                    <span><i className="dot dot--gekozen" /> gekozen</span>
                    <span><i className="dot dot--bezet" /> bezet</span>
                  </div>
                </div>
                <div className="slots-grid">
                  {alleTijdsloten.map(t => {
                    const bezet = bezetteTijdsloten.includes(t);
                    const active = tijdslot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`slot-chip ${bezet ? 'is-bezet' : ''} ${active ? 'is-active' : ''}`}
                        disabled={bezet}
                        onClick={() => setTijdslot(t)}
                      >
                        {t}
                      </button>
                    );
                  })}
                  {alleTijdsloten.length === 0 && (
                    <div className="slots-empty">Geen tijdsloten geladen.</div>
                  )}
                </div>
              </div>
            )}
          </form>
        )}

        {!afspraakIngediend && bedrijven.length === 0 && !loading && (
          <div className="no-speeddate-bedrijven">
            <p>Er zijn momenteel geen bedrijven beschikbaar die speeddate gesprekken aanbieden.</p>
            <button
              className="ghost-btn"
              onClick={() => navigate('/student/bedrijven')}
            >
              Bekijk alle bedrijven
            </button>
          </div>
        )}

        {afspraakIngediend && (
          <div className="result-actions">
            <button
              className="primary-btn"
              onClick={() => {
                setAfspraakIngediend(false);
                setTijdslot("");
                setAfspraakDetails(null);
                if (!presetBedrijf) setBedrijfId("");
              }}
            >
              Nieuwe speeddate afspraak
            </button>
            <button
              className="ghost-btn"
              onClick={() => navigate('/student')}
            >
              Terug naar dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}