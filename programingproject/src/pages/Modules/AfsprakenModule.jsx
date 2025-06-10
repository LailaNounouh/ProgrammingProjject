import React from "react";

export default function Afspraken() {
  return (
    <div className="page-container">
      <h2>Afspraak maken</h2>
      <p>Selecteer hieronder een bedrijf en een tijdslot om een afspraak vast te leggen.</p>

      <form>
        <label>Bedrijf:</label><br />
        <select required>
          <option value="">Kies een bedrijf</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Webdoos">Webdoos</option>
        </select><br /><br />

        <label>Tijdslot:</label><br />
        <select required>
          <option value="">Kies een tijd</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
        </select><br /><br />

        <button type="submit">Afspraak maken</button>
      </form>
    </div>
  );
}