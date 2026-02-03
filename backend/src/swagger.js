const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swagger: '2.0',
  info: {
    title: 'Auth + Tasks API',
    version: '1.0.0',
    description: 'API for user authentication and task management'
  },
  host: 'localhost:5000',
  basePath: '/api/v1',
  schemes: ['http'],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        parameters: [{
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' }
            }
          }
        }],
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Invalid input' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'User login',
        parameters: [{
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' }
            }
          }
        }],
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/tasks': {
      get: {
        summary: 'Get all user tasks',
        security: [{ Bearer: [] }],
        responses: {
          200: { description: 'List of tasks' }
        }
      },
      post: {
        summary: 'Create a new task',
        security: [{ Bearer: [] }],
        parameters: [{
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' }
            }
          }
        }],
        responses: {
          201: { description: 'Task created' }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a specific task',
        security: [{ Bearer: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'Task details' }
        }
      },
      put: {
        summary: 'Update a task',
        security: [{ Bearer: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' }
              }
            }
          }
        ],
        responses: {
          200: { description: 'Task updated' }
        }
      },
      delete: {
        summary: 'Delete a task',
        security: [{ Bearer: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'Task deleted' }
        }
      }
    }
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT Bearer token'
    }
  }
};

module.exports = swaggerUi.serve;
module.exports.setup = swaggerUi.setup(swaggerOptions);
