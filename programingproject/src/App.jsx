import React, { useState } from 'react';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      <Header />
      <nav style={{ textAlign: 'center', margin: '1rem' }}>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('login')}>Login</button>
      </nav>
      {page === 'home' && <Home />}
      {page === 'login' && <Login />}
      <Footer />
    </>
  );
}