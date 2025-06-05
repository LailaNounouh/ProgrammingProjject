import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get('/api/companies')
      .then(response => setCompanies(response.data))
      .catch(error => console.error('Er is een fout opgetreden:', error));
  }, []);

  return (
    <div>
      <h1>Bedrijvenlijst</h1>
      <ul>
        {companies.map(company => (
          <li key={company.id}>{company.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

