const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      `${process.env.FLOWISE_URL}/api/v1/prediction/${process.env.FLOW_ID}`,
      { question },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.FLOWISE_API_KEY && {
            Authorization: `Bearer ${process.env.FLOWISE_API_KEY}`
          })
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Flowise error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy backend running on port ${PORT}`);
});
