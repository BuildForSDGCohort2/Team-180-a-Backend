exports.swaggerOptions = (port) => ({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Learning API Documentation',
      version: '1.0.0',
      description: 'Full Documentation of of the e-learning system platform',
      termsOfService: 'http://api_url/terms/',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/',
      },
      contact: {
        name: 'Swagger',
        url: 'https://swagger.io',
        email: 'example@domain.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
      {
        url: 'https://api_url_testing',
        description: 'Testing server',
      },
      {
        url: 'https://api_url_production',
        description: 'Production server',
      },
    ],
  },
  apis: [
    './controllers/registerController.js',
    './routes/registerRoutes.js',
    './models/Teacher.js',
  ],
});
