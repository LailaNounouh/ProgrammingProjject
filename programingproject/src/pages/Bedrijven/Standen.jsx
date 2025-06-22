import React, { useState, useEffect } from "react";
// plattegrond importen
import Plattegrond from "../../components/plattegrond/plattegrond";

const Standen = () => {
  const [plattegrondData, setPlattegrondData] = useState({ plaatsen: { aula: [], tafel: [] }, stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlattegrondData = async () => {
      try {
        const response = await fetch("/api/admin/beschikbare-standen"); 
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
    <div className="standen-page">
      <h2>Overzicht van Standen</h2>
      <div className="plattegrond-visual">
        <Plattegrond plattegrondData={plattegrondData} />
      </div>
    </div>
  );
};

export default Standen;