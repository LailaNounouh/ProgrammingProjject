// backend/qrindex.js
const QRCode = require('qrcode');

app.get('/api/qrcode/:participantId', async (req, res) => {
  const pid = req.params.participantId;
  const data = JSON.stringify({ participantId: pid });
  try {
    const dataUrl = await QRCode.toDataURL(data);
    res.json({ dataUrl });
  } catch (err) {
    res.status(500).send(err);
  }
});

