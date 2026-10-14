const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'GoTicket API',
    description: 'Oficial documentation for the API from GoTicket.',
  },
  host: 'goticket-api-w7nh.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    githubOAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Log in by opening /login in a new browser tab. GitHub sends you back with a session cookie, and Swagger sends it automatically after that. Without it, POST, PUT and DELETE return 401.'
    }
  },
  '@definitions': {
    VenueCreate: {
      type: 'object',
      required: ['name', 'description', 'capacity', 'address', 'location', 'contactEmail'],
      properties: {
        name: { type: 'string', example: 'Downtown Concert Hall' },
        description: { type: 'string', example: 'A live music venue in downtown.' },
        capacity: { type: 'number', minimum: 0, example: 1200 },
        address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zipCode', 'country'],
          properties: {
            street: { type: 'string', example: '123 Main Street' },
            city: { type: 'string', example: 'Provo' },
            state: { type: 'string', example: 'UT' },
            zipCode: { type: 'string', example: '84601' },
            country: { type: 'string', example: 'United States' }
          }
        },
        location: {
          type: 'object',
          required: ['coordinates'],
          properties: {
            type: { type: 'string', enum: ['Point'], default: 'Point' },
            coordinates: {
              type: 'array',
              items: { type: 'number' },
              example: [-111.6585, 40.2338]
            }
          }
        },
        contactEmail: { type: 'string', format: 'email', example: 'info@example.com' },
        isActive: { type: 'boolean', default: true }
      }
    },
    TicketCreate: {
      type: 'object',
      required: ['userId', 'eventId', 'name', 'price', 'quantity', 'currency', 'salesStartDate', 'salesEndDate', 'maxTicketsPerCustomer'],
      properties: {
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '507f1f77bcf86cd799439011' },
        eventId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '507f1f77bcf86cd799439012' },
        name: { type: 'string', example: 'General Admission' },
        price: { type: 'number', minimum: 0, example: 35 },
        quantity: { type: 'number', minimum: 0, example: 2 },
        currency: { type: 'string', default: 'USD', example: 'USD' },
        salesStartDate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
        salesEndDate: { type: 'string', format: 'date-time', example: '2026-11-01T00:00:00.000Z' },
        maxTicketsPerCustomer: { type: 'number', minimum: 1, example: 4 },
        isActive: { type: 'boolean', default: true }
      }
    },
    VenueUpdate: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Downtown Concert Hall' },
        description: { type: 'string', example: 'A live music venue in downtown.' },
        capacity: { type: 'number', minimum: 0, example: 1200 },
        address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zipCode', 'country'],
          properties: {
            street: { type: 'string', example: '123 Main Street' },
            city: { type: 'string', example: 'Provo' },
            state: { type: 'string', example: 'UT' },
            zipCode: { type: 'string', example: '84601' },
            country: { type: 'string', example: 'United States' }
          }
        },
        location: {
          type: 'object',
          required: ['coordinates'],
          properties: {
            type: { type: 'string', enum: ['Point'], default: 'Point' },
            coordinates: {
              type: 'array',
              items: { type: 'number' },
              example: [-111.6585, 40.2338]
            }
          }
        },
        contactEmail: { type: 'string', format: 'email', example: 'info@example.com' },
        isActive: { type: 'boolean', default: true }
      }
    },
    TicketUpdate: {
      type: 'object',
      properties: {
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '507f1f77bcf86cd799439011' },
        eventId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '507f1f77bcf86cd799439012' },
        name: { type: 'string', example: 'General Admission' },
        price: { type: 'number', minimum: 0, example: 35 },
        quantity: { type: 'number', minimum: 0, example: 2 },
        currency: { type: 'string', default: 'USD', example: 'USD' },
        salesStartDate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
        salesEndDate: { type: 'string', format: 'date-time', example: '2026-11-01T00:00:00.000Z' },
        maxTicketsPerCustomer: { type: 'number', minimum: 1, example: 4 },
        isActive: { type: 'boolean', default: true }
      }
    },
    UserCreate: {
      type: 'object',
      required: ['firstName', 'lastName', 'email'],
      properties: {
        firstName: { type: 'string', example: 'Solomon' },
        lastName: { type: 'string', example: 'Kusasira' },
        email: { type: 'string', format: 'email', example: 'solomon@example.com' },
        role: { type: 'string', enum: ['attendee', 'admin'], example: 'attendee' },
        phone: { type: 'string', example: '+256700000000' },
        oauthProvider: { type: 'string', enum: ['google', 'github'] },
        oauthId: { type: 'string' },
        isActive: { type: 'boolean', default: true }
      }
    },
    UserUpdate: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Solomon' },
        lastName: { type: 'string', example: 'Kusasira' },
        email: { type: 'string', format: 'email', example: 'solomon@example.com' },
        role: { type: 'string', enum: ['attendee', 'admin'] },
        phone: { type: 'string' },
        oauthProvider: { type: 'string', enum: ['google', 'github'] },
        oauthId: { type: 'string' },
        isActive: { type: 'boolean' }
      }
    },
    EventCreate: {
      type: 'object',
      required: ['title', 'description', 'date', 'time', 'venueId', 'price', 'category'],
      properties: {
        title: { type: 'string', example: 'Summer Music Festival' },
        description: { type: 'string', example: 'A live music festival featuring local artists.' },
        date: { type: 'string', format: 'date-time', example: '2026-11-15T00:00:00.000Z' },
        time: { type: 'string', example: '19:30' },
        venueId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        price: { type: 'number', minimum: 0, example: 25 },
        category: {
          type: 'string',
          enum: ['concert', 'conference', 'sports', 'theatre', 'festival', 'workshop', 'other']
        },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'cancelled', 'completed'],
          default: 'draft'
        },
        organizerId: { type: 'string' },
        isActive: { type: 'boolean', default: true }
      }
    },
    EventUpdate: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        time: { type: 'string', example: '19:30' },
        venueId: { type: 'string' },
        price: { type: 'number', minimum: 0 },
        category: {
          type: 'string',
          enum: ['concert', 'conference', 'sports', 'theatre', 'festival', 'workshop', 'other']
        },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'cancelled', 'completed']
        },
        organizerId: { type: 'string' },
        isActive: { type: 'boolean' }
      }
    }
  }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);