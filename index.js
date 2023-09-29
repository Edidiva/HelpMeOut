const express = require('express');
const mongoose = require('mongoose');
const videoRoute = require('./routes/videoRoute');
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express');
const swagger= require('./documentation/swagger'); // Import your Swagger file

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

// Connecting to MongoDB 
mongoose.connect(process.env.MONGODB_CONNECTION_URL).then(()=> console.log("Database connection established")).catch(error=> console.log(error.message));

// Middleware for JSON parsing and serving static files
app.use(express.json());
app.use(express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
app.use('/api/videos', videoRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
