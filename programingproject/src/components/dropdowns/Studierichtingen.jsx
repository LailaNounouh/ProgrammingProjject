// /components/dropdowns/Studierichtingen.jsx
import React, { useEffect, useState } from "react";
import studierichtingenDataRaw from "./studierichtingen.json";

const Studierichtingen = ({ selectedStudie, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (studierichtingenDataRaw?.doelgroep_opleiding) {
      const sorted = [...studierichtingenDataRaw.doelgroep_opleiding].sort();
      setOptions(sorted);
    }
  }, []);

  return (
    <select
      id="studierichting"
      value={selectedStudie}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Kies een studierichting</option>
      {options.map((studie) => (
        <option key={studie} value={studie}>
          {studie}
        </option>
      ))}
    </select>
  );
};

export default Studierichtingen;