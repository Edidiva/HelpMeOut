const express = require('express');
const mongoose = require('mongoose');
const videoRoute = require('./routes/videoRoute');
const videosRoute = require('./routes/routes');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./documentation/swagger.js'); 
const cors = require('cors');
const yaml = require('yaml');
const bodyParser = require('body-parser')
dotenv.config();
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const swaggerDocument = yaml.parse(swaggerFile, 'utf8')

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => console.log('Database connection established'))
  .catch((error) => console.log(error.message));

// Middleware for JSON parsing and serving static files
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  "/storage",
  express.static(path.join(__dirname, "videos_uploads"))
);
// app.use(
//   "/media/files",
  
// );

app.use(
  cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', '*'],
    credentials: true,
  })
);

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/videos', videoRoute);
app.use('/api', videosRoute);
app.use("*", (req, res) => {
  res.status(404).json({
    msg: "route not found",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


