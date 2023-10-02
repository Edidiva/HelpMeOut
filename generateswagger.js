const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vidrec',
      version: '1.0.0',
    },
  },
  apis:[path.join(__dirname, 'routes', '*routes.js')]// Replace with the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

// Save the Swagger JSON to a file
const outputPath = path.join(__dirname, 'swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger JSON file generated successfully at ${outputPath}.`);
