import React, { useState, useEffect, useRef } from 'react';
import {
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaClock,
  FaExclamationCircle
} from 'react-icons/fa';
import './BedrijvenDashboard.css';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [bedrijfNaam, setBedrijfNaam] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    text: ''
  });
  const notificationRef = useRef(null);

  const upcomingEvents = [
    {
      date: new Date(2026, 2, 7),
      title: "Deadline voor inschrijven en stand reserveren",
      description: "Laatste kans om uw stand te reserveren voor de Career Launch Day",
      time: "23:59",
      deadline: true,
      highlight: true
    },
    {
      date: new Date(2026, 2, 11),
      title: "Online briefing voor bedrijven",
      description: "Informatiesessie over het verloop van de Career Launch Day",
      time: "14:00",
      highlight: true
    },
    {
      date: new Date(2026, 2, 13),
      title: "Career Launch Day",
      description: "Het belangrijkste recruitment event van het jaar",
      time: "09:00 - 17:00",
      highlight: true
    }
  ];

  useEffect(() => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;

    if (user?.type === 'bedrijf') {
      setBedrijfNaam(user.naam);
      const savedReminders = localStorage.getItem(`reminders_${user.id}`);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;
    const bedrijfId = user?.id;

    if (user?.type === 'bedrijf' && bedrijfId) {
      fetch(`/api/notifications/${bedrijfId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Netwerkfout bij ophalen meldingen');
          }
          return res.json();
        })
        .then(data => setNotifications(data))
        .catch(err => console.error('Fout bij ophalen meldingen:', err));
    }
  }, []);

  const addReminder = (reminder) => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;

    const newReminders = [...reminders, reminder];
    setReminders(newReminders);

    if (user?.id) {
      localStorage.setItem(`reminders_${user.id}`, JSON.stringify(newReminders));
    }

    setShowReminderModal(false);
    setNewReminder({
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      text: ''
    });
  };

  const addEventReminder = (event) => {
    const reminder = {
      date: event.date.toISOString().split('T')[0],
      time: event.time?.split('-')[0].trim() || '09:00',
      text: `Herinnering: ${event.title} - ${event.description}`
    };

    addReminder(reminder);
  };

  const deleteReminder = (index) => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;

    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);

    if (user?.id) {
      localStorage.setItem(`reminders_${user.id}`, JSON.stringify(newReminders));
    }
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();
    addReminder(newReminder);
  };

  const dashboardCards = [
    {
      title: "Staat van betaling",
      icon: <FaEuroSign className="icon-fix" />,
      description: "Bekijk uw betalingsstatus en facturen",
      onClick: () => navigate('/bedrijf/betaling'),
      iconClass: "bg-blue"
    },
    {
      title: "Afspraakoverzicht",
      icon: <FaCalendarAlt className="icon-fix" />,
      onClick: () => navigate('/bedrijf/afspraken'),
      iconClass: "bg-green",
      showAfspraken: true
    },
    {
      title: "Beschikbaarheid van standen",
      icon: <FaMapMarkerAlt className="icon-fix" />,
      description: "Beheer uw standlocaties en reserveringen",
      onClick: () => navigate('/bedrijf/standen'),
      iconClass: "bg-orange"
    },
    {
      title: "Bedrijfsinstellingen",
      icon: <FaCog className="icon-fix" />,
      description: "Beheer uw bedrijfsgegevens en voorkeuren",
      onClick: () => navigate('/bedrijf/Settingsbedrijf'),
      iconClass: "bg-purple"
    }
  ];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bedrijven-dashboard">
      {/* Hier hoort waarschijnlijk jouw DashboardContent-component met props */}
      {/* Als je die component apart hebt, voeg die hier correct toe. */}
      {/* Bijvoorbeeld: */}
      {/* <DashboardContent ...props /> */}
    </div>
  );
}

export default BedrijvenDashboard;
