import React, { useState, useEffect } from "react";
import "./AfsprakenModule.css";
import { baseUrl } from "../../config";
import io from "socket.io-client";

export default function Afspraken() {
  const [bedrijven, setBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [tijdslot, setTijdslot] = useState("");
  
  const [datum] = useState(formatDate(new Date()));
  const [beschikbareTijdsloten, setBeschikbareTijdsloten] = useState([]);
  const [bezetteTijdsloten, setBezetteTijdsloten] = useState([]);
  const [alleTijdsloten, setAlleTijdsloten] = useState([]);
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [socket, setSocket] = useState(null);

  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !bedrijfId) return;
    
    socket.emit('joinAppointmentRoom', { bedrijfId, datum });
    
    socket.on('appointmentCreated', (data) => {
      if (data.bedrijf_id === bedrijfId && data.datum === datum) {
        console.log('Appointment created by another user:', data);
  
        setBezetteTijdsloten(prev => [...prev, data.tijdslot]);
        setBeschikbareTijdsloten(prev => prev.filter(t => t !== data.tijdslot));
      }
    });
    
    return () => {
      socket.emit('leaveAppointmentRoom', { bedrijfId, datum });
      socket.off('appointmentCreated');
    };
  }, [socket, bedrijfId, datum]);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        setLoading(true);
        console.log(`Bedrijven ophalen van: ${baseUrl}/bedrijvenmodule`);
        
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!res.ok) throw new Error("Kon bedrijven niet ophalen");
        
        const data = await res.json();
        console.log("Bedrijven data:", data);
        setBedrijven(data);
      } catch (err) {
        console.error("Fout bij ophalen bedrijven:", err);
        setError("Er is een probleem opgetreden bij het ophalen van de bedrijven.");
      } finally {
        setLoading(false);
      }
    }

    fetchBedrijven();
  }, []);

  useEffect(() => {
    async function fetchTijdsloten() {
      if (!bedrijfId) return;
      
      try {
        setLoading(true);
        console.log(`Tijdsloten ophalen van: ${baseUrl}/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        
        const res = await fetch(`${baseUrl}/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        if (!res.ok) {
          console.error(`Server antwoordde met status: ${res.status}`);
          throw new Error("Kon tijdsloten niet ophalen");
        }
        
        const data = await res.json();
        console.log("Tijdsloten data:", data);
        
        setBeschikbareTijdsloten(data.beschikbaar || []);
        setBezetteTijdsloten(data.bezet || []);
        setAlleTijdsloten(data.alle || []);
        
        setTijdslot(""); 
      } catch (err) {
        console.error("Fout bij ophalen tijdsloten:", err);
        setError("Kon de beschikbare tijdsloten niet ophalen.");
      } finally {
        setLoading(false);
      }
    }

    fetchTijdsloten();
  }, [bedrijfId, datum, refreshTrigger]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bedrijfId || !tijdslot) {
      setError("Selecteer een bedrijf en een tijdslot");
      return;
    }

    try {
      setLoading(true);
      
      const userString = localStorage.getItem('user');
      let student_id;
      
      if (userString) {
        try {
          const user = JSON.parse(userString);
          console.log("Gebruikersinfo uit localStorage:", user);
          student_id = user.id;
          
          console.log("Gebruiker ID:", student_id);
        } catch (parseError) {
          console.error("Fout bij parsen gebruikersinfo:", parseError);
          setError("Gebruiker informatie kon niet worden geladen. Log opnieuw in.");
          setLoading(false);
          return;
        }
      } else {
        console.error("Geen gebruikersinfo gevonden in localStorage");
        setError("Je bent niet ingelogd. Log in om een afspraak te maken.");
        setLoading(false);
        return;
      }
      
      if (!student_id) {
        console.error("Geen geldig student_id gevonden");
        setError("Kon geen geldig gebruikers-ID vinden. Log opnieuw in.");
        setLoading(false);
        return;
      }
      
      console.log(`Submitting appointment to: ${baseUrl}/api/afspraken/nieuw`);
      console.log("Appointment data:", { student_id, bedrijf_id: bedrijfId, tijdslot, datum });
      
      const res = await fetch(`${baseUrl}/afspraken/nieuw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id,
          bedrijf_id: bedrijfId,
          tijdslot,
          datum,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Kon afspraak niet maken");
      }

      setBezetteTijdsloten(prev => [...prev, tijdslot]);
      setBeschikbareTijdsloten(prev => prev.filter(t => t !== tijdslot));
      
      setRefreshTrigger(prev => prev + 1);

      setAfspraakIngediend(true);
      setError("");
    } catch (err) {
      console.error("Fout bij maken afspraak:", err);
      setError(err.message || "Er is een probleem opgetreden bij het maken van de afspraak.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container afspraken-module">
      <h2 className="module-title">Afspraak maken</h2>
      <p className="module-subtext">
        Selecteer een bedrijf om de beschikbare tijdsloten voor te zien.
      </p>

      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!afspraakIngediend ? (
        <div className="form-blok">
          <form onSubmit={handleSubmit}>
            <label>Bedrijf:</label><br />
            <select
              required
              className="form-select"
              value={bedrijfId}
              onChange={(e) => setBedrijfId(e.target.value)}
              disabled={loading}
            >
              <option value="">Kies een bedrijf</option>
              {bedrijven.map((bedrijf) => (
                <option key={bedrijf.bedrijf_id} value={bedrijf.bedrijf_id}>
                  {bedrijf.naam}
                </option>
              ))}
            </select>

            {bedrijfId && (
              <>
                <h3>Tijdsloten:</h3>
                {loading ? (
                  <p>Tijdsloten laden...</p>
                ) : alleTijdsloten.length > 0 ? (
                  <div className="tijdslot-grid">
                    {alleTijdsloten.map((tijd) => {
                      const isBezet = bezetteTijdsloten.includes(tijd);
                      const isGekozen = tijdslot === tijd;
                      
                      return (
                        <button
                          key={tijd}
                          type="button"
                          disabled={isBezet}
                          className={`tijdslot-btn ${isBezet ? "bezet" : ""} ${isGekozen ? "gekozen" : ""}`}
                          onClick={() => setTijdslot(tijd)}
                        >
                          {tijd} {isBezet ? "🔒" : ""}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p>Geen tijdsloten beschikbaar voor vandaag.</p>
                )}
                
                <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                  <p>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
                      Beschikbaar
                    </span>
                    {" "}
                    <span style={{ backgroundColor: '#ffdddd', padding: '2px 8px', borderRadius: '4px', marginLeft: '10px' }}>
                      Bezet 🔒
                    </span>
                  </p>
                </div>
              </>
            )}

            <br />
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!bedrijfId || !tijdslot || loading}
            >
              {loading ? "Bezig..." : "Afspraak maken"}
            </button>
          </form>
        </div>
      ) : (
        <div className="overzicht-blok">
          <p className="bevestiging"><strong>✅ Je afspraak is ingediend!</strong></p>
          <p><strong>Bedrijf:</strong> {bedrijven.find(b => b.bedrijf_id === parseInt(bedrijfId))?.naam}</p>
          <p><strong>Tijdslot:</strong> {tijdslot}</p>
          <button 
            className="btn-submit" 
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setAfspraakIngediend(false);
              setTijdslot("");
            }}
          >
            Nieuwe afspraak maken
          </button>
        </div>
      )}
    </div>
  );
}