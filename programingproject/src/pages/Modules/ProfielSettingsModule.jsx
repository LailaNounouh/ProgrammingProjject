import React, { useState, useEffect } from "react";
import "./ProfielSettingsModule.css";

import TaalSelector from "../../components/dropdowns/TaalSelector";
import CodeertaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";

import { baseUrl } from "../../config";
import { useProfile } from "../../context/ProfileContext";

export default function ProfielSettingsModule() {
  const { profile, fetchProfile } = useProfile();

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    aboutMe: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        naam: profile.naam || "",
        email: profile.email || "",
        telefoon: profile.telefoon || "",
        aboutMe: profile.aboutMe || "",
      });
    }
  }, [profile]);

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
    data.append("naam", formData.naam);
    data.append("email", formData.email);
    data.append("telefoon", formData.telefoon);
    data.append("aboutMe", formData.aboutMe);
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      const response = await fetch(`${baseUrl}/studentenaccount`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Fout bij opslaan van profiel");

      await fetchProfile();
      alert("Profiel succesvol opgeslagen!");
    } catch (error) {
      console.error("Fout bij verzenden:", error);
      alert(`Er ging iets mis: ${error.message}`);
    }
  };

  return (
    <div className="profiel-module">
      <h1>Mijn Profiel</h1>
      <p>Vul je persoonlijke en professionele informatie in.</p>

      <form className="template-form" onSubmit={handleSubmit}>
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
              required
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
              required
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
              required
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
              required
            />
          </div>
        </section>

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
    </div>
  );
}
