import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Aanwezigheid.css';

const Attendance = () => {
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    byType: [],
    recent: [], 
    hourly: []
  });

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttendanceStats = async () => {
    try {
      const response = await fetch('/api/attendance/stats');
      const data = await response.json();
      if (data.success) {
        setAttendanceStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  const fetchAttendees = async (page = 1) => {
    try {
      const response = await fetch(`/api/attendance/attendees?page=${page}&limit=20`);
      const data = await response.json();
      if (data.success) {
        setAttendees(data.attendees);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAttendanceStats(),
        fetchAttendees()
      ]);
      setLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      fetchAttendanceStats();
      fetchAttendees(currentPage);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      'student': 'Student',
      'werkzoekende': 'Werkzoekende',
      'visitor': 'Bezoeker'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <main className="admin-main">
          <div className="loading">Gegevens laden...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="back-button-wrapper">
        <Link to="/admin" className="back-button">← Terug naar dashboard</Link>
      </div>

      <main className="admin-main">
        <section className="bedrijven-section">
          <h2>Aanwezigheid Beheer</h2>
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>Totaal Aanwezig</h3>
              <div className="stat-number">{attendanceStats.total}</div>
            </div>
            {attendanceStats.byType.map((typeData) => (
              <div key={typeData.participant_type} className="stat-card">
                <h3>{getTypeLabel(typeData.participant_type)}</h3>
                <div className="stat-number">{typeData.count}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bedrijven-section">
          <h2>Recente Check-ins</h2>
          <div className="recent-list">
            {attendanceStats.recent.length > 0 ? (
              attendanceStats.recent.map((checkin, index) => (
                <div key={index} className="recent-item">
                  <div className="recent-info">
                    <strong>{checkin.participant_name}</strong>
                    <span className="recent-email">{checkin.participant_email}</span>
                  </div>
                  <div className="recent-meta">
                    <span className="recent-type">{getTypeLabel(checkin.participant_type)}</span>
                    <span className="recent-time">{formatTime(checkin.check_in_time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Nog geen check-ins vandaag</p>
            )}
          </div>
        </section>

        <section className="bedrijven-section">
          <h2>Alle Deelnemers</h2>
          <div className="attendees-table-container">
            <table className="attendees-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Check-in Tijd</th>
                </tr>
              </thead>
              <tbody>
                {attendees.length > 0 ? (
                  attendees.map((attendee) => (
                    <tr key={attendee.attendance_id}>
                      <td>{attendee.participant_name}</td>
                      <td>{attendee.participant_email}</td>
                      <td>
                        <span className={`type-badge ${attendee.participant_type}`}>
                          {getTypeLabel(attendee.participant_type)}
                        </span>
                      </td>
                      <td>{formatTime(attendee.check_in_time)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Geen deelnemers gevonden</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => fetchAttendees(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Vorige
              </button>
              <span className="pagination-info">
                Pagina {currentPage} van {totalPages}
              </span>
              <button 
                onClick={() => fetchAttendees(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Volgende
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Attendance;
