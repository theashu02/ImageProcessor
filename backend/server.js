const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageRouter = require('../backend/src/imageRoutes.js'); // Adjust the path as needed
const dotenv = require("dotenv");
dotenv.config(); 

const app = express();
const PORT = 5000;
// const __dirname = path.resolve();

// Middleware
app.use(cors());
// for deployment
//imageprocessor-rera.onrender.com/
app.use(
  cors({
    origin: "http://imageprocessor-rera.onrender.com",
  })
);

https: app.use(bodyParser.json({ limit: "50mb" })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Increase the limit as needed


// Use the image router
app.use('/api', imageRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
