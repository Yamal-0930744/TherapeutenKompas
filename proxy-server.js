const express = require('express');
const cors = require('cors');
const app = express();

const API_KEY = 'TK-sffslk45465retryty56fgdffhgj';

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  const messages = req.body.messages;

  const userHistory = messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => `${msg.role === 'user' ? 'Gebruiker' : 'Bot'}: ${msg.content}`)
    .join(' | ');

  try {
    const apiResponse = await fetch(`https://ai.therapeutenkompas.nl/ai-chat?question=${encodeURIComponent(userHistory)}&verbose=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const contentType = apiResponse.headers.get('content-type');
    const data = contentType.includes('application/json')
      ? await apiResponse.json()
      : await apiResponse.text();

    res.send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Er ging iets mis met de AI server.");
  }
});

app.listen(3000, () => console.log('✅ Proxy running on GET-compatible AI at http://localhost:3000'));
