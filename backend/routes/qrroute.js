const fetch = require('node-fetch');

fetch('http://localhost:5000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'https://example.com' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

