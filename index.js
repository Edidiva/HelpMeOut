const express = require('express');
const mongoose = require('mongoose');
const videoRoute = require('./routes/videoRoute');
const videosRoute = require('./routes/routes');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
const cors = require('cors');
const { startAgenda } = require('./agenda');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => console.log('Database connection established'))
  .catch((error) => console.log(error.message));

// Middleware for JSON parsing and serving static files
app.use(express.json());
app.use(express.static('uploads'));
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
app.use('/api/video', videosRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start the Agenda job processing
startAgenda();
