import React, { useState, useEffect } from "react";
import "./AfsprakenModule.css";
import { baseUrl } from "../../config";

export default function Afspraken() {
  const [bedrijven, setBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [tijdslot, setTijdslot] = useState("");
  // Use today's date as default and fixed date
  const [datum] = useState(formatDate(new Date()));
  const [beschikbareTijdsloten, setBeschikbareTijdsloten] = useState([]);
  const [bezetteTijdsloten, setBezetteTijdsloten] = useState([]);
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Format date as YYYY-MM-DD for API
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Fetch companies on component mount
  useEffect(() => {
    async function fetchBedrijven() {
      try {
        setLoading(true);
        console.log(`Fetching companies from: ${baseUrl}/api/bedrijvenmodule`);
        
        const res = await fetch(`${baseUrl}/api/bedrijvenmodule`);
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

  // Fetch available time slots when company changes
  useEffect(() => {
    async function fetchTijdsloten() {
      if (!bedrijfId) return;
      
      try {
        setLoading(true);
        console.log(`Fetching time slots from: ${baseUrl}/api/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        
        const res = await fetch(`${baseUrl}/api/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        if (!res.ok) {
          console.error(`Server responded with status: ${res.status}`);
          throw new Error("Kon tijdsloten niet ophalen");
        }
        
        const data = await res.json();
        console.log("Tijdsloten data:", data);
        
        // Explicitly set both available and occupied time slots
        setBeschikbareTijdsloten(data.beschikbaar || []);
        setBezetteTijdsloten(data.bezet || []);
        
        setTijdslot(""); // Reset selected time slot
      } catch (err) {
        console.error("Fout bij ophalen tijdsloten:", err);
        setError("Kon de beschikbare tijdsloten niet ophalen.");
      } finally {
        setLoading(false);
      }
    }

    fetchTijdsloten();
  }, [bedrijfId, datum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bedrijfId || !tijdslot) {
      setError("Selecteer een bedrijf en een tijdslot");
      return;
    }

    try {
      setLoading(true);
      // Get the student_id from localStorage - use the 'id' field from user info
      const userInfoString = localStorage.getItem('userInfo');
      let student_id;
      
      if (userInfoString) {
        try {
          const userInfo = JSON.parse(userInfoString);
          student_id = userInfo.id;
        } catch (parseError) {
          console.error("Error parsing user info:", parseError);
          student_id = 1; // Fallback
        }
      } else {
        student_id = 1; // Fallback if no user info
      }
      
      console.log(`Submitting appointment to: ${baseUrl}/api/afspraken/nieuw`);
      console.log("Appointment data:", { student_id, bedrijf_id: bedrijfId, tijdslot, datum });
      
      const res = await fetch(`${baseUrl}/api/afspraken/nieuw`, {
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
        Selecteer een bedrijf om de beschikbare tijdsloten voor vandaag ({datum}) te zien.
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
                <h3>Beschikbare tijdsloten:</h3>
                {loading ? (
                  <p>Tijdsloten laden...</p>
                ) : beschikbareTijdsloten.length > 0 ? (
                  <div className="tijdslot-grid">
                    {beschikbareTijdsloten.map((tijd) => {
                      const isGekozen = tijdslot === tijd;
                      
                      return (
                        <button
                          key={tijd}
                          type="button"
                          className={`tijdslot-btn ${isGekozen ? "gekozen" : ""}`}
                          onClick={() => setTijdslot(tijd)}
                        >
                          {tijd}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p>Geen tijdsloten beschikbaar voor vandaag.</p>
                )}
                
                {/* Also display the occupied time slots (for debugging) */}
                {bezetteTijdsloten.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4>Bezette tijdsloten:</h4>
                    <div className="tijdslot-grid">
                      {bezetteTijdsloten.map((tijd) => (
                        <button
                          key={tijd}
                          type="button"
                          className="tijdslot-btn bezet"
                          disabled
                        >
                          {tijd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
          <p><strong>Datum:</strong> {datum}</p>
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
