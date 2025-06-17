import React, { useState } from "react";
import { baseUrl } from "../../config"; // Pas aan indien je baseUrl elders definieert

export default function LogoUploadForm({ bedrijfId }) {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch(`${baseUrl}/bedrijven/upload-logo/${bedrijfId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("✅ Logo succesvol geüpload!");
      } else {
        setFeedback("❌ Upload mislukt: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setFeedback("❌ Er is een fout opgetreden tijdens de upload.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>Upload je bedrijfslogo:</label><br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      /><br /><br />
      <button type="submit">Upload</button>
      <p>{feedback}</p>
    </form>
  );
}
