import react from 'react';
import './Home.css';
import Header from '../components/layout/Header';

export default function Home() {
  return (
    <div className="home">
      <Header />
      <div className="home-content">
        <h1>Welcome to the Home Page</h1>
        <p>This is the main content area of the home page.</p>
      </div>
    </div>
  );
}