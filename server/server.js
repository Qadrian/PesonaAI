const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Initialize the express app
const app = express();

// Middleware to allow cross-origin requests from your frontend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set the port for the server to listen on
const PORT = process.env.PORT || 5001;

// The main API endpoint that your React app will call
app.post('/api/ask', async (req, res) => {
  // Retrieve the Flowise URL and API Key from your .env file
  const flowiseApiEndpoint = process.env.FLOWISE_API_ENDPOINT;
  const flowiseApiKey = process.env.FLOWISE_API_KEY;

  // Check if the credentials are provided in the .env file
  if (!flowiseApiEndpoint || !flowiseApiKey) {
    return res.status(500).json({ error: 'Flowise API credentials are not configured on the server.' });
  }

  try {
    // Get the user's question from the request body sent by the React app
    const { question } = req.body;

    // Make a POST request from this server to the actual Flowise API
    const flowiseResponse = await axios.post(
      flowiseApiEndpoint,
      { question: question }, // The data payload for Flowise
      {
        // Add the secret API key to the Authorization header
        headers: {
          'Authorization': `Bearer ${process.env.FLOWISE_API_KEY}`
        }
      }
    );

    // Send the response from Flowise back to your React app
    res.json(flowiseResponse.data);

  } catch (error) {
    // Log the detailed error on the server for debugging
    console.error('Error calling Flowise API:', error.message);
    
    // Send a generic error message back to the frontend
    res.status(500).json({ error: 'Failed to communicate with the AI service.' });
  }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
