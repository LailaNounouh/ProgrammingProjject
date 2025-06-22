import React, { useState, useEffect } from 'react';
import Plattegrond from '../../components/plattegrond/plattegrond';

const StandenModule = () => {
  const [plattegrondData, setPlattegrondData] = useState({ plaatsen: { aula: [], tafel: [] }, stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlattegrondData = async () => {
      try {
        const response = await fetch("/api/admin/beschikbare-standen"); // Assuming same endpoint as admin
        const data = await response.json();
        setPlattegrondData(data);
        setLoading(false);
      } catch (error) {
        console.error("Fout bij ophalen plattegrond data:", error);
        setLoading(false);
      }
    };
    fetchPlattegrondData();
  }, []);

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <div className="standen-module">
      <h2>Interactieve Kaart: Standen</h2>
      <div className="plattegrond-container">
        <Plattegrond plattegrondData={plattegrondData} />
      </div>
    </div>
  );
};

export default StandenModule;
