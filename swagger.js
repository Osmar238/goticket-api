const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'GoTicket API',
    description: 'Oficial documentation for the API from GoTicket.',
  },
  host: 'goticket-api-w7nh.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);