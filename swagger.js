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
        // Venue names are unique, so this must not match a venue already in the database
        name: { type: 'string', example: 'Lagos Arena' },
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
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '6ac87e1bc9b31f712fd24145' },
        eventId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '6ac87e1cc9b31f712fd2414a' },
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
      // Only send the fields you want to change. name is left out of the example
      // because venue names are unique and a copied name would clash.
      properties: {
        name: { type: 'string', example: 'Lagos Arena' },
        description: { type: 'string', example: 'An indoor arena for concerts and sports, now expanded.' },
        capacity: { type: 'number', minimum: 0, example: 6500 },
        contactEmail: { type: 'string', format: 'email', example: 'bookings@lagosarena.com' },
        isActive: { type: 'boolean', default: true }
      },
      example: {
        description: 'An indoor arena for concerts and sports, now expanded.',
        capacity: 6500
      }
    },
    TicketUpdate: {
      type: 'object',
      properties: {
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '6ac87e1bc9b31f712fd24145' },
        eventId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '6ac87e1cc9b31f712fd2414a' },
        name: { type: 'string', example: 'General Admission' },
        price: { type: 'number', minimum: 0, example: 35 },
        quantity: { type: 'number', minimum: 0, example: 2 },
        currency: { type: 'string', default: 'USD', example: 'USD' },
        salesStartDate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
        salesEndDate: { type: 'string', format: 'date-time', example: '2026-11-01T00:00:00.000Z' },
        maxTicketsPerCustomer: { type: 'number', minimum: 1, example: 4 },
        isActive: { type: 'boolean', default: true }
      },
      example: {
        price: 50,
        quantity: 100
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
        isActive: { type: 'boolean', default: true }
      }
    },
    UserUpdate: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Solomon' },
        lastName: { type: 'string', example: 'Kusasira' },
        email: { type: 'string', format: 'email', example: 'solomon@example.com' },
        role: { type: 'string', enum: ['attendee', 'admin'], example: 'admin' },
        phone: { type: 'string', example: '+256700000000' },
        isActive: { type: 'boolean', example: true }
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
        venueId: { type: 'string', example: '6ac87e1bc9b31f712fd24147' },
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
        organizerId: { type: 'string', example: '6ac87e1bc9b31f712fd24145' },
        isActive: { type: 'boolean', default: true }
      }
    },
    EventUpdate: {
      type: 'object',
      // The PUT route checks title, date and venueId, so the example sends them
      required: ['title', 'date', 'venueId'],
      properties: {
        title: { type: 'string', example: 'Summer Music Festival' },
        description: { type: 'string', example: 'A live music festival featuring local artists, now with a late show.' },
        date: { type: 'string', format: 'date-time', example: '2026-11-15T00:00:00.000Z' },
        time: { type: 'string', example: '21:00' },
        venueId: { type: 'string', example: '6ac87e1bc9b31f712fd24147' },
        price: { type: 'number', minimum: 0, example: 40 },
        category: {
          type: 'string',
          enum: ['concert', 'conference', 'sports', 'theatre', 'festival', 'workshop', 'other'],
          example: 'concert'
        },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'cancelled', 'completed'],
          example: 'published'
        },
        organizerId: { type: 'string', example: '6ac87e1bc9b31f712fd24145' },
        isActive: { type: 'boolean', example: true }
      }
    }
  }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);