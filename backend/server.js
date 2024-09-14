const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageRouter = require('../backend/src/imageRoutes.js'); // Adjust the path as needed

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Increase the limit as needed


// Use the image router
app.use('/api', imageRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
