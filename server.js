const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://webrtc-client-sigma.vercel.app',
  'http://localhost:3000',
  'http://192.168.1.95:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/ice', async (req, res) => {
    try {
      const auth = Buffer.from(`${process.env.XIRSYS_IDENT}:${process.env.XIRSYS_SECRET}`).toString('base64');
  
      const response = await fetch('https://global.xirsys.net/_turn/comm360', {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + auth,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      console.log('[XIRSYS FULL RESPONSE]', JSON.stringify(data, null, 2)); // 🛠️ log full response
  
      res.json({ iceServers: data.v.iceServers });
    } catch (e) {
      console.error('[ICE ERROR]', e);
      res.status(500).json({ error: 'Failed to fetch ICE servers', details: e.message });
    }
  });  

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));