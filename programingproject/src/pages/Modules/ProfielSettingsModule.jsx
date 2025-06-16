import React, { useState, useEffect } from "react";
import "./ProfielSettingsModule.css";
import { useProfile } from "../../context/ProfileContext";

import TaalSelector from "../../components/dropdowns/TaalSelector";
import CodeertaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";

import { baseUrl } from "../../config";

export default function ProfielSettingsModule() {
  const { profile, fetchProfile } = useProfile();

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    aboutMe: "",
    github: "",
    linkedin: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // Bij mount eerst localStorage checken en evt. data laden
  useEffect(() => {
    const savedData = localStorage.getItem("localProfileData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else if (profile) {
      setFormData({
        naam: profile.naam || "",
        email: profile.email || "",
        telefoon: profile.telefoon || "",
        aboutMe: profile.aboutMe || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
      });
    }
  }, [profile]);

  // LocalStorage updaten bij elke wijziging van formData
  useEffect(() => {
    localStorage.setItem("localProfileData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.naam) data.append("naam", formData.naam);
    if (formData.email) data.append("email", formData.email);
    if (formData.telefoon) data.append("telefoon", formData.telefoon);
    if (formData.aboutMe) data.append("aboutMe", formData.aboutMe);
    if (formData.github) data.append("github", formData.github);
    if (formData.linkedin) data.append("linkedin", formData.linkedin);
    if (profilePicture) data.append("profilePicture", profilePicture);

    if (profile?.type) {
      data.append("type", profile.type);
    }

    try {
      const response = await fetch(`${baseUrl}/profiel`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Fout bij opslaan van profiel");

      await fetchProfile();
      setMessage("Profiel succesvol opgeslagen!");
      setMessageType("success");

      // LocalStorage leegmaken na succesvolle sync
      localStorage.removeItem("localProfileData");

      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    } catch (error) {
      console.error("Fout bij verzenden:", error);
      setMessage(`Er ging iets mis: ${error.message}`);
      setMessageType("error");
    }
  };

  return (
    <div className="profiel-module">
      <h1>Mijn Profiel</h1>
      <p>Vul je persoonlijke en professionele informatie in.</p>

      <form className="template-form" onSubmit={handleSubmit}>
        {/* Persoonlijke gegevens */}
        <section className="form-group">
          <h2>Persoonlijke Gegevens</h2>

          <div className="form-field">
            <label htmlFor="naam">Naam</label>
            <input
              type="text"
              id="naam"
              name="naam"
              value={formData.naam}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="telefoon">Telefoonnummer</label>
            <input
              type="tel"
              id="telefoon"
              name="telefoon"
              value={formData.telefoon}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="profilePicture">Profielfoto</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="aboutMe">Over mij</label>
            <textarea
              id="aboutMe"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              rows="4"
              placeholder="Vertel iets over jezelf..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="github">GitHub Link</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/jouwnaam"
            />
          </div>

          <div className="form-field">
            <label htmlFor="linkedin">LinkedIn Link</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/jouwprofiel"
            />
          </div>
        </section>

        {/* Selectors voor skills en talen */}
        <section className="form-group">
          <h2>Talenkennis</h2>
          <TaalSelector />
        </section>

        <section className="form-group">
          <h2>Programmeertalen</h2>
          <CodeertaalSelector />
        </section>

        <section className="form-group">
          <h2>Soft Skills</h2>
          <SoftSkillsSelector />
        </section>

        <section className="form-group">
          <h2>Hard Skills</h2>
          <HardSkillsSelector />
        </section>

        <div className="form-footer">
          <button type="submit">Opslaan</button>
        </div>
      </form>

      {message && <div className={`notification ${messageType}`}>{message}</div>}
    </div>
  );
}
