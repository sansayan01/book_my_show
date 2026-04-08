const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookMyShow API',
      version: '1.0.0',
      description: 'API documentation for BookMyShow clone backend',
      contact: {
        name: 'API Support',
        email: 'support@bookmyshow.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            show: { type: 'string' },
            movie: { type: 'string' },
            cinema: { type: 'string' },
            seats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: { type: 'string' },
                  number: { type: 'number' },
                  category: { type: 'string' },
                  price: { type: 'number' }
                }
              }
            },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
            ticketCode: { type: 'string' },
            showDate: { type: 'string', format: 'date' },
            showTime: { type: 'string' }
          }
        },
        Show: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            movie: { type: 'string' },
            cinema: { type: 'string' },
            screen: { type: 'string' },
            screenFormat: { type: 'string', enum: ['2D', '3D', 'IMAX', '4DX'] },
            date: { type: 'string', format: 'date' },
            time: { type: 'string' },
            duration: { type: 'number' },
            price: { type: 'number' },
            availableSeats: { type: 'number' },
            totalSeats: { type: 'number' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Server health check endpoints'
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Movies',
        description: 'Movie management endpoints'
      },
      {
        name: 'Cinemas',
        description: 'Cinema management endpoints'
      },
      {
        name: 'Shows',
        description: 'Showtime management endpoints'
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

// Swagger UI options
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #e5493a }
  `,
  customSiteTitle: 'BookMyShow API Docs',
  customfavIcon: '/favicon.ico'
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  
  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};