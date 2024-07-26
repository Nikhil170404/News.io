const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Use cors package for easier CORS management
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// List of API keys
const API_KEYS = [
  'cba9f5744bd141c1a8ee18e94adf6b84', // Replace with your actual primary API key
  '68c528de0b5a4b32a54340505b102236',
  '24d4c27b0216444eb167938b8aad71f5',
  '4a202b93377b4af3b130b37cc5c4c8b8',
  '8018484aac554ecfa4a883422b34f15f'
];

const fetchFromNewsAPI = async (url, headers, params) => {
  try {
    const response = await axios.get(url, { headers, params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getNextApiKey = () => {
  const key = API_KEYS.shift(); // Get the next key
  API_KEYS.push(key); // Put it back to the end of the list
  return key;
};

app.get('/top-headlines', async (req, res) => {
  const url = 'https://newsapi.org/v2/top-headlines';
  let apiKey = getNextApiKey();

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const data = await fetchFromNewsAPI(url, { 'Authorization': apiKey }, req.query);
      return res.json(data);
    } catch (error) {
      console.error(`Error with API key ${apiKey}:`, error.message);
      apiKey = getNextApiKey(); // Try the next API key
    }
  }

  res.status(500).json({ error: 'Error fetching top headlines' });
});

app.get('/top-headlines/sources', async (req, res) => {
  const url = 'https://newsapi.org/v2/sources';
  let apiKey = getNextApiKey();

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const data = await fetchFromNewsAPI(url, { 'Authorization': apiKey }, req.query);
      return res.json(data);
    } catch (error) {
      console.error(`Error with API key ${apiKey}:`, error.message);
      apiKey = getNextApiKey(); // Try the next API key
    }
  }

  res.status(500).json({ error: 'Error fetching sources' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
