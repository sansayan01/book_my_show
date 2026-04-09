/**
 * GraphQL Schema for BookMyShow API
 * Provides a GraphQL API layer for querying and mutating data
 */

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { GraphQLScalarType, Kind } = require('graphql');

// Custom DateTime scalar
const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 DateTime',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  }
});

// Type definitions
const typeDefs = `
  scalar DateTime

  type Health {
    status: String!
    timestamp: DateTime!
    uptime: Float!
    database: DatabaseHealth!
    memory: MemoryInfo!
    cache: CacheStats!
  }

  type DatabaseHealth {
    status: String!
    pingMs: Int
    healthy: Boolean!
  }

  type MemoryInfo {
    heapUsed: String!
    heapTotal: String!
    heapPercent: String!
    rss: String!
  }

  type CacheStats {
    size: Int!
    hits: Int!
    misses: Int!
    hitRate: Float!
  }

  type Analytics {
    totalUsers: Int!
    totalBookings: Int!
    totalRevenue: Float!
    popularMovies: [MovieAnalytics!]!
    bookingsByDay: [DayBookings!]!
  }

  type MovieAnalytics {
    movieId: ID!
    title: String!
    bookingCount: Int!
  }

  type DayBookings {
    date: String!
    count: Int!
  }

  type APIUsageStats {
    totalRequests: Int!
    avgResponseTime: Float!
    requestsPerMinute: Float!
    errorRate: Float!
    topEndpoints: [EndpointUsage!]!
  }

  type EndpointUsage {
    path: String!
    count: Int!
    avgResponseTime: Float!
  }

  type ConnectionPoolStats {
    active: Int!
    available: Int!
    total: Int!
    queued: Int!
  }

  type Query {
    health(deep: Boolean): Health!
    analytics(startDate: DateTime, endDate: DateTime): Analytics
    apiUsageStats: APIUsageStats!
    connectionPoolStats: ConnectionPoolStats!
    ping: String!
  }

  type Mutation {
    clearCache: Boolean!
    resetAnalytics: Boolean!
  }
`;

// Mock resolvers
const resolvers = {
  DateTime,
  Query: {
    health: (_, { deep } = { deep: false }) => {
      const mongoose = require('mongoose');
      const cacheService = require('../services/cacheService');
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      const dbState = mongoose.connection.readyState;
      
      const health = {
        status: dbState === 1 ? 'healthy' : 'degraded',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: {
          status: states[dbState] || 'unknown',
          pingMs: null,
          healthy: dbState === 1
        },
        memory: {
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          heapPercent: `${Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%`,
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`
        },
        cache: cacheService.getStats()
      };

      // Deep health check: ping database
      if (deep) {
        if (dbState === 1) {
          const start = Date.now();
          mongoose.connection.db.admin().ping().then(() => {
            health.database.pingMs = Date.now() - start;
          }).catch(() => {
            health.database.healthy = false;
          });
        }
      }

      return health;
    },

    analytics: async (_, { startDate, endDate }) => {
      // Mock analytics data
      return {
        totalUsers: Math.floor(Math.random() * 10000) + 5000,
        totalBookings: Math.floor(Math.random() * 50000) + 20000,
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        popularMovies: [
          { movieId: '1', title: 'Blockbuster Movie 1', bookingCount: Math.floor(Math.random() * 5000) },
          { movieId: '2', title: 'Blockbuster Movie 2', bookingCount: Math.floor(Math.random() * 5000) },
          { movieId: '3', title: 'Blockbuster Movie 3', bookingCount: Math.floor(Math.random() * 5000) }
        ],
        bookingsByDay: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 500) + 100
        }))
      };
    },

    apiUsageStats: () => {
      const analyticsService = require('../services/apiAnalyticsService');
      return analyticsService.getStats();
    },

    connectionPoolStats: () => {
      const mongoose = require('mongoose');
      const pool = mongoose.connection;
      return {
        active: pool.readyState === 1 ? Math.floor(Math.random() * 5) + 1 : 0,
        available: pool.readyState === 1 ? 10 - (Math.floor(Math.random() * 5) + 1) : 0,
        total: 10,
        queued: Math.floor(Math.random() * 3)
      };
    },

    ping: () => 'pong'
  },

  Mutation: {
    clearCache: () => {
      const cacheService = require('../services/cacheService');
      cacheService.clear();
      return true;
    },

    resetAnalytics: () => {
      const analyticsService = require('../services/apiAnalyticsService');
      analyticsService.reset();
      return true;
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
