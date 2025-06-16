import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfielModule.css";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthProvider";
import { baseUrl } from "../../config";

const ProfielModule = () => {
  const { gebruiker, checkAuthStatus } = useAuth();
  const { profiel, fetchProfiel, loading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthStatus()) {
      navigate("/login");
      return;
    }

    if (gebruiker?.id) {
      fetchProfiel(); // Haalt het profiel op uit de backend (database)
    }
  }, [gebruiker, fetchProfiel, checkAuthStatus, navigate]);

  if (loading) return <div>Profiel wordt geladen...</div>;
  if (!gebruiker) return <div>Je moet ingelogd zijn om je profiel te bekijken</div>;
  if (!profiel) return <div>Geen profiel gevonden</div>;

  const {
    naam,
    email,
    telefoon,
    aboutMe,
    foto_url,
    github_url,
    linkedin_url,
    talen = [],
    programmeertalen = [],
    softSkills = [],
    hardSkills = [],
  } = profiel;

  return (
    <div className="account-pagina">
      <h1>{naam || "Naam niet ingevuld"}</h1>

      <div className="account-header">
        <img
          src={foto_url ? `${baseUrl}/${foto_url}` : "/default-profile.png"}
          alt={`Profielfoto van ${naam}`}
          className="account-foto"
        />
        <p className="account-about">{aboutMe || "Geen beschrijving beschikbaar."}</p>
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {email || "Niet ingevuld"}</p>
        <p><strong>Telefoon:</strong> {telefoon || "Niet ingevuld"}</p>

        {github_url && (
          <p>
            <strong>GitHub:</strong>{" "}
            <a href={github_url.startsWith("http") ? github_url : `https://${github_url}`} target="_blank" rel="noopener noreferrer">
              {github_url}
            </a>
          </p>
        )}

        {linkedin_url && (
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a href={linkedin_url.startsWith("http") ? linkedin_url : `https://${linkedin_url}`} target="_blank" rel="noopener noreferrer">
              {linkedin_url}
            </a>
          </p>
        )}

        <h3>Talenkennis</h3>
        <ul>
          {talen.length > 0 ? talen.map((taal, i) => <li key={i}>{taal}</li>) : <li>Geen talen opgegeven</li>}
        </ul>

        <h3>Programmeertalen</h3>
        <ul>
          {programmeertalen.length > 0 ? programmeertalen.map((code, i) => <li key={i}>{code}</li>) : <li>Geen programmeertalen opgegeven</li>}
        </ul>

        <h3>Soft Skills</h3>
        <ul>
          {softSkills.length > 0 ? softSkills.map((s, i) => <li key={i}>{s}</li>) : <li>Geen soft skills opgegeven</li>}
        </ul>

        <h3>Hard Skills</h3>
        <ul>
          {hardSkills.length > 0 ? hardSkills.map((s, i) => <li key={i}>{s}</li>) : <li>Geen hard skills opgegeven</li>}
        </ul>
      </div>
    </div>
  );
};

export default ProfielModule;
