const express = require('express');
const axios = require('axios');
const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Route to fetch and serve images
app.get('/fetchImage', async (req, res) => {
  try {
    // Fetch image from original source
    const imageUrl = req.query.imageUrl; // Example: http://example.com/image.jpg
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary').toString('base64');
    
    // Set appropriate content type
    res.setHeader('Content-Type', 'image/jpeg');
    
    // Serve image data
    res.send(imageData);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
