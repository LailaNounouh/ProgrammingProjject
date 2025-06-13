import React, { useState, useEffect } from 'react';
import './aanwezigheid.css'; 

const AttendanceOverview = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Haal alle evenementen op bij het laden van de component
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/qr/events');
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events);
          // Probeer 'career launch 2025-2026' automatisch te selecteren
          const careerLaunchEvent = data.events.find(event => 
            event.naam.toLowerCase().includes('career launch') && 
            (event.datum.includes('2025') || event.datum.includes('2026'))
          );
          if (careerLaunchEvent) {
            setSelectedEventId(careerLaunchEvent.id.toString());
          }
        } else {
          setError(data.error || 'Fout bij het ophalen van evenementen');
        }
      } catch (err) {
        setError('Netwerkfout bij het ophalen van evenementen');
        console.error('Fetch events error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Haal aanwezigheidslijst op wanneer een evenement is geselecteerd
    const fetchAttendance = async () => {
      if (!selectedEventId) {
        setAttendanceList([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/qr/attendance/${selectedEventId}`);
        const data = await response.json();
        if (response.ok) {
          setAttendanceList(data.deelnemers);
        } else {
          setError(data.error || 'Fout bij het ophalen van de aanwezigheidslijst');
        }
      } catch (err) {
        setError('Netwerkfout bij het ophalen van de aanwezigheidslijst');
        console.error('Fetch attendance error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedEventId]);

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
  };

  return (
    <div className="attendance-overview-container">
      <div className="attendance-overview-card">
        <h2>Aanwezigheidsoverzicht</h2>
        <p className="subtitle">Bekijk de geregistreerde aanwezigheid per evenement.</p>

        <div className="event-selection-section">
          <h3>Selecteer Evenement</h3>
          <select 
            value={selectedEventId} 
            onChange={handleEventChange}
            className="event-select"
            disabled={loading}
          >
            <option value="">-- Kies een evenement --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.naam} ({new Date(event.datum).toLocaleDateString('nl-NL')})
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="loading-message">Laden van gegevens...</p>}
        {error && <p className="error-message">Fout: {error}</p>}

        {selectedEventId && !loading && !error && (
          <div className="attendance-list-section">
            <h3>Aanwezigen voor {events.find(e => e.id === parseInt(selectedEventId))?.naam} ({attendanceList.length})</h3>
            {attendanceList.length > 0 ? (
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Naam</th>
                      <th>E-mail</th>
                      <th>Type</th>
                      <th>Tijd van Aanwezigheid</th>
                      <th>Methode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((deelnemer, index) => (
                      <tr key={index}>
                        <td>{deelnemer.naam}</td>
                        <td>{deelnemer.email}</td>
                        <td>{deelnemer.type}</td>
                        <td>{new Date(deelnemer.aanwezig_op).toLocaleString('nl-NL')}</td>
                        <td>{deelnemer.registratie_methode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data-message">Geen aanwezigheden geregistreerd voor dit evenement.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceOverview;