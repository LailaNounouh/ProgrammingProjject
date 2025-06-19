import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import LogoUploadForm from "../../components/forms/LogoUploadform";
import { useAuth } from "../../context/AuthProvider"; // voor bedrijfId
import "./Settingsbedrijf.css";

const Settingsbedrijf = () => {
  const { user } = useAuth(); // haalt ingelogde bedrijf-ID op
  const navigate = useNavigate();

  const [bedrijfsgegevens, setBedrijfsgegevens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Haal bedrijfsgegevens op bij mount en user.id
  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/bedrijven/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Kon bedrijfsgegevens niet ophalen");
        return res.json();
      })
      .then(data => {
        setBedrijfsgegevens(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBedrijfsgegevens(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/bedrijven/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bedrijfsgegevens)
    })
      .then(res => {
        if (!res.ok) throw new Error("Kon bedrijfsgegevens niet opslaan");
        alert("Bedrijfsgegevens succesvol opgeslagen!");
        navigate("/Bedrijvendashboard");
      })
      .catch(err => alert(err.message));
  };

  const handleTerug = () => {
    navigate("/Bedrijf");
  };

  if (loading) return <p>Laden...</p>;
  if (error) return <p style={{color:"red"}}>{error}</p>;
  if (!bedrijfsgegevens) return null;

  return (
    <div className="instellingen-pagina">
      <div className="instellingen-container">
        <button onClick={handleTerug} className="terug-knop">
          <FiArrowLeft className="terug-icoon" /> Terug naar dashboard
        </button>

        <div className="instellingen-header">
          <h1>Instellingen</h1>
          <p className="instellingen-subtitel">Beheer hier de contactgegevens van uw bedrijf</p>
        </div>

        <form onSubmit={handleSubmit} className="bedrijfsformulier">
          {/* ...formulier velden zoals in jouw originele code, met value={bedrijfsgegevens.veld} en onChange={handleChange}... */}
          {/* Bijvoorbeeld: */}
          <section className="form-sectie">
            <div className="sectie-inhoud">
              <h2 className="sectie-titel">Bedrijfsgegevens</h2>
              <div className="formulier-groep">
                <label className="formulier-label required">Bedrijfsnaam</label>
                <input
                  type="text"
                  name="bedrijfsnaam"
                  value={bedrijfsgegevens.bedrijfsnaam || ""}
                  onChange={handleChange}
                  required
                  className="formulier-input"
                />
              </div>
              {/* herhaal dit patroon voor alle andere velden... */}
            </div>
          </section>
          
          {/* Facturatie, Beurs, LogoUploadForm blijven hetzelfde */}
          <LogoUploadForm bedrijfId={user?.id} />
          <button type="submit" className="opslaan-knop">Wijzigingen opslaan</button>
        </form>
      </div>
    </div>
  );
};

export default Settingsbedrijf;
