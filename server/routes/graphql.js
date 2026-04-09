/**
 * GraphQL Route
 * Provides GraphQL API endpoint
 */

const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { routeCors } = require('../middleware/securityHeaders');
const schema = require('../graphql/schema');

const router = express.Router();

// GraphQL endpoint with CORS
router.use('/',
  routeCors({
    origins: ['*'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
  }),
  createHandler({
    schema,
    graphiql: {
      defaultQuery: `# Welcome to BookMyShow GraphQL API
#
# Try querying:
# {
#   health(deep: true) {
#     status
#     timestamp
#     database { status healthy }
#   }
# }
`,
      headerEditorEnabled: true
    }
  })
);

module.exports = router;
